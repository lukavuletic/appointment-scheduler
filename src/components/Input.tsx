import React from 'react';

interface Props {
    text?: string;
    readOnly: boolean;
}

export const Input: React.FC<Props> = ({ text, readOnly }) => {
    return (
        <input value={text} readOnly={readOnly} />
    )
}