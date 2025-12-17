import { useState, useCallback } from 'react';

/**
 * Hook personalizado para validación de formularios
 * Proporciona validación reutilizable para campos comunes
 */
export const useFormValidation = () => {
    const [errors, setErrors] = useState({});

    /**
     * Valida que un campo no esté vacío
     * @param {string} value - Valor del campo
     * @param {string} fieldName - Nombre del campo para el mensaje de error
     * @returns {string|null} - Mensaje de error o null si es válido
     */
    const validateRequired = useCallback((value, fieldName) => {
        if (!value || !value.trim()) {
            return `El campo ${fieldName} es obligatorio`;
        }
        return null;
    }, []);

    /**
     * Valida formato de email
     * @param {string} email - Email a validar
     * @returns {string|null} - Mensaje de error o null si es válido
     */
    const validateEmail = useCallback((email) => {
        if (!email || !email.trim()) {
            return 'El email es obligatorio';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return 'Por favor, ingresa un correo electrónico válido';
        }
        return null;
    }, []);

    /**
     * Valida longitud mínima de un campo
     * @param {string} value - Valor del campo
     * @param {number} minLength - Longitud mínima requerida
     * @param {string} fieldName - Nombre del campo
     * @returns {string|null} - Mensaje de error o null si es válido
     */
    const validateMinLength = useCallback((value, minLength, fieldName) => {
        if (value && value.trim().length < minLength) {
            return `${fieldName} debe tener al menos ${minLength} caracteres`;
        }
        return null;
    }, []);

    /**
     * Valida un formulario de contacto completo
     * @param {Object} formData - Datos del formulario { name, email, message }
     * @returns {Object} - { isValid: boolean, errors: Object }
     */
    const validateContactForm = useCallback((formData) => {
        const newErrors = {};

        const nameError = validateRequired(formData.name, 'nombre');
        if (nameError) newErrors.name = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const messageError = validateRequired(formData.message, 'mensaje');
        if (messageError) newErrors.message = messageError;

        const messageMinError = validateMinLength(formData.message, 10, 'El mensaje');
        if (messageMinError && !messageError) newErrors.message = messageMinError;

        setErrors(newErrors);

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors
        };
    }, [validateRequired, validateEmail, validateMinLength]);

    /**
     * Limpia todos los errores
     */
    const clearErrors = useCallback(() => {
        setErrors({});
    }, []);

    /**
     * Limpia un error específico
     * @param {string} fieldName - Nombre del campo
     */
    const clearFieldError = useCallback((fieldName) => {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    }, []);

    return {
        errors,
        validateRequired,
        validateEmail,
        validateMinLength,
        validateContactForm,
        clearErrors,
        clearFieldError
    };
};

export default useFormValidation;
