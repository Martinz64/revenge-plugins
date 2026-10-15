import { onFluxEventDispatched } from "@revenge-mod/discord/flux";
import React, { useState, useEffect } from 'react';

const PresenceUpdatedContainer = ({ children }) => {
    const [counter, setCounter] = useState(0);
    useEffect(() => {

        const unsub = onFluxEventDispatched('PRESENCE_UPDATES', () => {
            setCounter(prevCounter => prevCounter + 1);
        })

        //FluxDispatcher.subscribe('PRESENCE_UPDATES',presenceUpdate);
        return () => {
            unsub()
            //FluxDispatcher.unsubscribe('PRESENCE_UPDATES',presenceUpdate);
        };
    }, []);
    
    //return children;
    return (
        React.Children.map(children, (child, index) => {
            return React.cloneElement(child, { key: `${index}-${counter}` });
        })
    );
};

export default PresenceUpdatedContainer