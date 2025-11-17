
import React, { useState } from 'react';
import { Button } from './Button';
import { CopyIcon } from '../icons/CopyIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface CopyButtonProps {
    textToCopy: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if (!textToCopy) return;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    return (
        <Button onClick={handleCopy} disabled={!textToCopy || isCopied} className="flex-grow">
            {isCopied ? (
                <>
                    <CheckIcon className="w-5 h-5 mr-2" /> Copied!
                </>
            ) : (
                <>
                    <CopyIcon className="w-5 h-5 mr-2" /> Copy
                </>
            )}
        </Button>
    );
};
