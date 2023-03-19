type OperationResult<T> = {
    error?: string;
    data?: T;
    code: number;
};

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export { OperationResult, WithRequired };
