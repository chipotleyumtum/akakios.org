import React, { useEffect, useRef } from 'react';

interface CircuitNode {
  x: number;
  y: number;
  connections: number[];
}

const CircuitBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();
    
    // Generate circuit nodes
    const nodes: CircuitNode[] = [];
    const nodeCount = Math.floor(window.innerWidth * window.innerHeight / 25000);
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        connections: []
      });
    }
    
    // Connect nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < connectionCount; j++) {
        let closestNodeIndex = -1;
        let closestDistance = Infinity;
        
        for (let k = 0; k < nodes.length; k++) {
          if (i === k || node.connections.includes(k)) continue;
          
          const distance = Math.sqrt(
            Math.pow(node.x - nodes[k].x, 2) + 
            Math.pow(node.y - nodes[k].y, 2)
          );
          
          if (distance < closestDistance && distance < canvas.width / 5) {
            closestDistance = distance;
            closestNodeIndex = k;
          }
        }
        
        if (closestNodeIndex !== -1) {
          node.connections.push(closestNodeIndex);
          nodes[closestNodeIndex].connections.push(i);
        }
      }
    }
    
    // Animation variables
    let animationFrame: number;
    let pulseTime = 0;
    
    // Draw circuit
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update pulse time
      pulseTime = timestamp / 1000;
      
      // Draw connections
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 163, 185, 0.15)';
      ctx.shadowColor = 'rgba(0, 163, 185, 0.4)';
      ctx.shadowBlur = 5;
      
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        for (const connectionIndex of node.connections) {
          const connectedNode = nodes[connectionIndex];
          
          // Only draw each connection once
          if (i < connectionIndex) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();
            
            // Draw pulse animation along the line
            const distance = Math.sqrt(
              Math.pow(node.x - connectedNode.x, 2) + 
              Math.pow(node.y - connectedNode.y, 2)
            );
            
            const pulseSpeed = 100; // pixels per second
            const pulsePosition = (pulseTime * pulseSpeed) % (distance * 2);
            const normalizedPosition = pulsePosition > distance ? 2 * distance - pulsePosition : pulsePosition;
            
            const ratio = normalizedPosition / distance;
            const pulseX = node.x + (connectedNode.x - node.x) * ratio;
            const pulseY = node.y + (connectedNode.y - node.y) * ratio;
            
            ctx.fillStyle = 'rgba(0, 163, 185, 0.8)';
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      
      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = 'rgba(0, 163, 185, 0.6)';
        ctx.shadowColor = 'rgba(0, 163, 185, 0.8)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      animationFrame = requestAnimationFrame(draw);
    };
    
    animationFrame = requestAnimationFrame(draw);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="circuit-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.15,
        pointerEvents: 'none'
      }}
    />
  );
};

export default CircuitBackground;
