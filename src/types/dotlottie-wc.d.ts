declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      autoplay?: boolean;
      loop?: boolean;
      mode?: 'normal' | 'bounce' | 'reverse' | 'alternate';
      speed?: number;
      direction?: 1 | -1;
      hover?: boolean;
      'background-color'?: string;
      'web-component'?: boolean;
    };
  }
}
