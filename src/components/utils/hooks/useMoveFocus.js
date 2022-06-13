import { useState, useEffect } from 'react';

export default function useMoveFocus() {
    const [active, setActive] = useState(null);

    const handleFocusIn = (e) => {
        const activeElement = document.activeElement.className;
        if (activeElement.find(element => element == 'move-slot')) {
            setActive(activeElement[-1]);
        }
    }

    useEffect(() => {
        document.addEventListener('focusin', handleFocusIn);
        return () => {
            document.removeEventListener('focusin', handleFocusIn)
        };
    }, []);

    return active;
}