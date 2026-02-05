import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
    children: ReactNode;
}

const Portal = ({ children }: PortalProps) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const portalRoot = document.querySelector("#portal-root");
        if (!portalRoot) {
            const newPortalRoot = document.createElement('div');
            newPortalRoot.id = "portal-root";
            document.body.appendChild(newPortalRoot);
        }
        return () => setMounted(false);
    }, []);

    const portalRoot = document.querySelector("#portal-root");
    if (!portalRoot) return null;

    return mounted
        ? createPortal(children, portalRoot)
        : null;
};

export default Portal;
