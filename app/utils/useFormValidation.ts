import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

export const useFormValidation = <T>(schema: ZodSchema<T>) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [values, setValues] = useState<Partial<T>>({});

    const validate = useCallback(
        (data: Partial<T>): boolean => {
            try {
                schema.parse(data);
                setErrors({});
                return true;
            } catch (error) {
                if (error instanceof ZodError) {
                    const fieldErrors: Record<string, string> = {};
                    error.issues.forEach((err) => {
                        const path = err.path[0] as string;
                        if (path) {
                            fieldErrors[path] = err.message;
                        }
                    });
                    setErrors(fieldErrors);
                }
                return false;
            }
        },
        [schema]
    );

    const validateField = useCallback(
        (field: keyof T, value: unknown): string | undefined => {
            try {
                schema.parse({ ...values, [field]: value });
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[field as string];
                    return newErrors;
                });
                return undefined;
            } catch (error) {
                if (error instanceof ZodError) {
                    const fieldError = error.issues.find(
                        (err) => err.path[0] === field
                    );
                    if (fieldError) {
                        setErrors((prev) => ({
                            ...prev,
                            [field as string]: fieldError.message,
                        }));
                        return fieldError.message;
                    }
                }
                return undefined;
            }
        },
        [schema, values]
    );

    const setValue = useCallback((field: keyof T, value: unknown) => {
        setValues((prev) => ({ ...prev, [field]: value }));
      
        if (errors[field as string]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field as string];
                return newErrors;
            });
        }
    }, [errors]);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors((prev) => ({
            ...prev,
            [field as string]: error,
        }));
    }, []);

    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    const getFieldError = useCallback(
        (field: keyof T): string | undefined => {
            return errors[field as string];
        },
        [errors]
    );

    return {
        values,
        errors,
        validate,
        validateField,
        setValue,
        setFieldError,
        clearErrors,
        getFieldError,
    };
};

