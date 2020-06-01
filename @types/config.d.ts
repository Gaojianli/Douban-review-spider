declare module '*config.json' {
    export interface config {
        movie_limit: number,
        review_limit: number,
        headers: Headers | string[][] | {
            [key: string]: string;
        }
    }
}