export interface Size {
  width: number;
  height: number;
}

export function detectWindowSize(): Size {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}