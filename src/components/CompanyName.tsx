import React from 'react';

interface Props {
    name: string;
}

export const CompanyName: React.FC<Props> = ({ name }) => {
    return (
        <div>{name}</div>
    )
}