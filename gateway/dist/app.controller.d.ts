export declare class AppController {
    testConnection(): Promise<{
        status: string;
        connectedToAuth: boolean;
        authServiceResponse: any;
        message?: undefined;
        error?: undefined;
    } | {
        status: string;
        connectedToAuth: boolean;
        message: string;
        error: any;
        authServiceResponse?: undefined;
    }>;
}
