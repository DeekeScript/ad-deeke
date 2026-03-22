declare global {
    class Rect {
        left: number;
        top: number;
        right: number;
        bottom: number;

        constructor(left: number, top: number, right: number, bottom: number);
        public height(): number;
        public width(): number;
        public centerX(): number;
        public centerY(): number;
    }
}

export { };
