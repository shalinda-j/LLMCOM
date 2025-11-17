
import React from 'react';
import { Button } from './Button';
import { DownloadIcon } from '../icons/DownloadIcon';

interface DownloadButtonProps {
    onDownload: (format: 'txt' | 'json') => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ onDownload }) => {
    return (
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => onDownload('txt')}>
                <DownloadIcon className="w-5 h-5 mr-2" /> .txt
            </Button>
            <Button variant="secondary" onClick={() => onDownload('json')}>
                <DownloadIcon className="w-5 h-5 mr-2" /> .json
            </Button>
        </div>
    );
};
