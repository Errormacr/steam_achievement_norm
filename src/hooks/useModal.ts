import { useState, useEffect, useCallback } from 'react';

export const useModal = (modalContentSelector = '.modal-content') => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = useCallback(() => setIsOpen(true), []);
    const closeModal = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(modalContentSelector)) {
                closeModal();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, closeModal, modalContentSelector]);

    return { isOpen, openModal, closeModal };
};
