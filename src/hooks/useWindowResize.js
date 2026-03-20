import { useState, useRef, useCallback } from 'react';

export function useWindowResize({ 
  initialWidth, 
  initialHeight, 
  minWidth = 300, 
  minHeight = 200,
  containerRef 
}) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const dragRef = useRef({ active: false, edge: null, startX: 0, startY: 0, startWidth: 0, startHeight: 0 });

  const onMouseDown = useCallback((e, edge) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation();

    dragRef.current = {
      active: true,
      edge,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [size.width, size.height]);

  const onMouseMove = useCallback((e) => {
    if (!dragRef.current.active) return;

    const { edge, startX, startY, startWidth, startHeight } = dragRef.current;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (edge.includes('right')) {
      newWidth = Math.max(minWidth, startWidth + deltaX);
    } else if (edge.includes('left')) {
      newWidth = Math.max(minWidth, startWidth - deltaX);
    }

    if (edge.includes('bottom')) {
      newHeight = Math.max(minHeight, startHeight + deltaY);
    } else if (edge.includes('top')) {
      newHeight = Math.max(minHeight, startHeight - deltaY);
    }

    setSize({ width: newWidth, height: newHeight });
  }, [minWidth, minHeight]);

  const onMouseUp = useCallback(() => {
    dragRef.current.active = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }, []);

  const bindResize = (edge) => ({
    onMouseDown: (e) => onMouseDown(e, edge),
  });

  return {
    width: size.width,
    height: size.height,
    bindResize,
  };
}
