type OperationResult<T> = {
    error?: string;
    data?: T;
    code: number;
};

export { OperationResult };
