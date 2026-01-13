declare module 'react' {
    namespace React {
        type ReactNode = any;
        type FC<P = {}> = (props: P) => any;
        type FormEvent<T = any> = { preventDefault: () => void; target: any };
        type ChangeEvent<T = any> = { target: { value: string } };
        
        function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
        function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        function useContext<T>(context: Context<T>): T;
        function createContext<T>(defaultValue: T): Context<T>;
        
        interface Context<T> {
            Provider: FC<{ value: T; children?: ReactNode }>;
            Consumer: FC<{ children: (value: T) => ReactNode }>;
        }
    }
    export = React;
    export as namespace React;
}

declare module 'react/jsx-runtime' {
    export const jsx: any;
    export const jsxs: any;
    export const Fragment: any;
}

declare module 'react-dom/client' {
    export function createRoot(container: any): any;
}
