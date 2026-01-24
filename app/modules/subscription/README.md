# Stripe Integration

Este módulo gerencia a integração com o Stripe para assinaturas premium.

## Componentes Disponíveis

### 1. CheckoutWebView (Atual)
Utiliza WebView para exibir o Stripe Checkout Session.

**Prós:**
- Implementação mais simples no backend
- Usa Stripe Checkout Session (gerenciado pelo Stripe)
- Não precisa lidar com PCI compliance no app

**Contras:**
- Problemas de performance em Android
- User experience menos integrada
- Requer User Agent spoofing para funcionar corretamente

### 2. StripeCheckout (Novo - SDK Nativo)
Utiliza `@stripe/stripe-react-native` para checkout nativo.

**Prós:**
- Performance muito melhor
- UX mais integrada com o app
- Suporte nativo para Apple Pay / Google Pay
- Não depende de WebView

**Contras:**
- Requer alteração no backend para usar Payment Intent
- Implementação um pouco mais complexa

## Configuração Atual

### App.tsx
```tsx
import { StripeProvider } from '@stripe/stripe-react-native';
import { config } from './utils/config';

<StripeProvider
  publishableKey={config.stripePublishableKey}
  urlScheme="financecontrol"
  merchantIdentifier="merchant.com.financecontrolapp"
>
  {/* App content */}
</StripeProvider>
```

### config.ts
```typescript
export const config = {
  stripePublishableKey: getEnvVar(
    'STRIPE_PUBLISHABLE_KEY',
    'pk_test_51QaANULvMRpw2EcBZHGIwN8DfNa7gNL7cEaJxD18OfjP8vjkYcGYJKRisgJZyXtRFkvYKcWJKfM1I4b60jDDYCyB00fRZy9f0J'
  ),
};
```

### app.json
```json
{
  "plugins": [
    "@stripe/stripe-react-native"
  ],
  "expo": {
    "scheme": "financecontrol"
  }
}
```

## Como Migrar para o SDK Nativo

### 1. Atualizar o Backend

Atualmente, o endpoint `/api/subscription/checkout` retorna:
```typescript
{
  sessionId: string;
  url: string;
}
```

Crie um novo endpoint `/api/subscription/create-payment-intent` que retorne:
```typescript
{
  clientSecret: string;
  publishableKey?: string; // Opcional se já estiver configurado no app
}
```

#### Exemplo de implementação no backend (Node.js/Express):
```javascript
// POST /api/subscription/create-payment-intent
app.post('/api/subscription/create-payment-intent', async (req, res) => {
  try {
    const { userId } = req.user; // do token JWT
    
    // Buscar ou criar customer no Stripe
    let customer = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    if (customer.data.length === 0) {
      customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: userId.toString() }
      });
    } else {
      customer = customer.data[0];
    }
    
    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 9900, // R$ 99,00 em centavos
      currency: 'brl',
      customer: customer.id,
      metadata: {
        userId: userId.toString(),
        planType: 'PREMIUM'
      },
      // Para assinaturas recorrentes, use setup_future_usage
      setup_future_usage: 'off_session'
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook para confirmar pagamento
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const userId = paymentIntent.metadata.userId;
      
      // Atualizar usuário para premium no banco de dados
      await updateUserSubscription(userId, {
        isPremium: true,
        subscriptionStatus: 'ACTIVE',
        stripeCustomerId: paymentIntent.customer
      });
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

### 2. Criar novo thunk para Payment Intent

Em `subscriptionApi.ts`:
```typescript
export interface PaymentIntentResponse {
  clientSecret: string;
}

export const createPaymentIntent = createAsyncThunk<
  PaymentIntentResponse,
  void,
  { state: RootState; rejectValue: string }
>('subscription/createPaymentIntent', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const token = (auth as { token: string | null }).token;

    if (!token) {
      return rejectWithValue('Token não encontrado');
    }

    const response = await apiClient.post<PaymentIntentResponse>(
      '/api/subscription/create-payment-intent',
      {},
      { Authorization: `Bearer ${token}` },
    );

    return response;
  } catch (error) {
    const apiError = error as ApiError;
    return rejectWithValue(apiError.message || 'Erro ao criar pagamento');
  }
});
```

### 3. Atualizar subscriptionSlice.ts

```typescript
interface SubscriptionState {
  // ... outros campos
  clientSecret: string | null;
}

const initialState: SubscriptionState = {
  // ... outros campos
  clientSecret: null,
};

// No extraReducers:
.addCase(createPaymentIntent.fulfilled, (state, action) => {
  state.checkoutLoading = false;
  state.clientSecret = action.payload.clientSecret;
})
```

### 4. Atualizar SubscriptionScreen

```tsx
import { StripeCheckout } from '@app/modules/subscription/components';

export default function SubscriptionScreen() {
  const { clientSecret, checkoutUrl } = useAppSelector((state) => state.subscription);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);

  // Handle clientSecret - show native Stripe checkout
  useEffect(() => {
    if (clientSecret) {
      setShowStripeCheckout(true);
    }
  }, [clientSecret]);

  const handleSubscribe = async () => {
    if (isPremium) {
      Alert.alert('Atenção', 'Você já possui uma assinatura ativa.');
      return;
    }

    try {
      // Tente usar Payment Intent (novo método)
      await dispatch(createPaymentIntent()).unwrap();
    } catch (err) {
      // Fallback para Checkout Session (método antigo)
      await dispatch(createCheckoutSession()).unwrap();
    }
  };

  return (
    <ScreenWithHeader>
      {/* ... conteúdo da tela ... */}

      {/* Native Stripe Checkout (novo) */}
      {clientSecret && (
        <StripeCheckout
          visible={showStripeCheckout}
          clientSecret={clientSecret}
          onClose={() => {
            setShowStripeCheckout(false);
            dispatch(clearClientSecret()); // Criar essa action
          }}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* WebView Checkout (fallback) */}
      {checkoutUrl && (
        <CheckoutWebView
          visible={showWebView}
          url={checkoutUrl}
          onClose={handleWebViewClose}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      )}
    </ScreenWithHeader>
  );
}
```

## Usando Apple Pay / Google Pay

O StripeCheckout já está preparado para aceitar Apple Pay e Google Pay. Para habilitar:

### iOS (Apple Pay)
1. Configure o `merchantIdentifier` no `StripeProvider` (já configurado)
2. Adicione Apple Pay capability no Xcode
3. Configure o Merchant ID no Apple Developer Portal

### Android (Google Pay)
1. Adicione ao `android/app/src/main/AndroidManifest.xml`:
```xml
<meta-data
  android:name="com.google.android.gms.wallet.api.enabled"
  android:value="true" />
```

2. No componente, use:
```tsx
import { isPlatformPaySupported, PlatformPay } from '@stripe/stripe-react-native';

const { presentPlatformPay } = usePlatformPay();

// Verificar se está disponível
const isAvailable = await isPlatformPaySupported();

if (isAvailable) {
  // Mostrar botão de Apple/Google Pay
}
```

## Variáveis de Ambiente

Adicione ao `.env`:
```
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

E no `app.json`:
```json
{
  "expo": {
    "extra": {
      "STRIPE_PUBLISHABLE_KEY": "pk_test_xxxxx"
    }
  }
}
```

## Testing

### Cartões de teste do Stripe:
- **Sucesso**: `4242 4242 4242 4242`
- **Falha**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use qualquer data futura, qualquer CVC de 3 dígitos e qualquer CEP.

## Troubleshooting

### WebView não abre no Android
- Verifique se o `hardwareAccelerated="true"` está no AndroidManifest.xml
- Verifique o User Agent no CheckoutWebView

### Native SDK não funciona
- Verifique se o plugin está instalado: `npx expo install @stripe/stripe-react-native`
- Rode `npx expo prebuild` após instalar o plugin
- Limpe o build: `cd android && ./gradlew clean && cd .. && cd ios && pod install`

### Apple Pay não funciona
- Verifique o merchantIdentifier
- Configure no Apple Developer Portal
- Teste em dispositivo real (não funciona no simulador)

## Documentação

- [Stripe React Native SDK](https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet)
- [Expo Stripe Plugin](https://docs.expo.dev/versions/latest/sdk/stripe/)
- [Payment Intents API](https://docs.stripe.com/api/payment_intents)
