interface ApiResponse<T> {
    data: T;
    statusCode: number;
    success: boolean;
    message?: string;
    error?: string;
}
