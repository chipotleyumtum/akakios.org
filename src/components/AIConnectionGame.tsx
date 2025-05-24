import React, { useState, useEffect, useRef } from 'react';

interface AIConnectionGameProps {
  onComplete: (score: number) => void;
}

const AIConnectionGame: React.FC<AIConnectionGameProps> = ({ onComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  interface Node {
    id: number;
    x: number;
    y: number;
    type: 'data' | 'ai' | 'output';
    connected: boolean;
  }

  interface Connection {
    from: number;
    to: number;
    valid: boolean;
  }

  const [nodes, setNodes] = useState<Node[]>([]);

  // Initialize game
  useEffect(() => {
    if (gameStarted && !gameCompleted) {
      initializeGame();
      setTimeLeft(60);
    }
  }, [gameStarted]);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameCompleted]);

  // Canvas drawing
  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    window.addEventListener('resize', updateCanvasSize);
    updateCanvasSize();

    // Animation loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      connections.forEach(connection => {
        const fromNode = nodes.find(n => n.id === connection.from);
        const toNode = nodes.find(n => n.id === connection.to);
        
        if (fromNode && toNode) {
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = connection.valid ? 'rgba(0, 255, 0, 0.6)' : 'rgba(255, 0, 0, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw data flow animation
          if (connection.valid) {
            const pulseTime = Date.now() / 1000;
            const pulseSpeed = 100; // pixels per second
            const distance = Math.sqrt(
              Math.pow(fromNode.x - toNode.x, 2) + 
              Math.pow(fromNode.y - toNode.y, 2)
            );
            
            const pulsePosition = (pulseTime * pulseSpeed) % (distance * 2);
            const normalizedPosition = pulsePosition > distance ? 2 * distance - pulsePosition : pulsePosition;
            
            const ratio = normalizedPosition / distance;
            const pulseX = fromNode.x + (toNode.x - fromNode.x) * ratio;
            const pulseY = fromNode.y + (toNode.y - fromNode.y) * ratio;
            
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      
      // Draw nodes
      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        
        let gradient;
        if (node.id === selectedNode) {
          gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 25);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
          ctx.fillStyle = gradient;
        } else {
          switch (node.type) {
            case 'data':
              gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 20);
              gradient.addColorStop(0, 'rgba(0, 163, 255, 0.9)');
              gradient.addColorStop(1, 'rgba(0, 163, 255, 0.4)');
              break;
            case 'ai':
              gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 20);
              gradient.addColorStop(0, 'rgba(255, 123, 0, 0.9)');
              gradient.addColorStop(1, 'rgba(255, 123, 0, 0.4)');
              break;
            case 'output':
              gradient = ctx.createRadialGradient(node.x, node.y, 5, node.x, node.y, 20);
              gradient.addColorStop(0, 'rgba(0, 255, 128, 0.9)');
              gradient.addColorStop(1, 'rgba(0, 255, 128, 0.4)');
              break;
          }
          ctx.fillStyle = gradient || 'rgba(200, 200, 200, 0.6)';
        }
        
        ctx.fill();
        ctx.strokeStyle = node.connected ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Node label
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.type.toUpperCase(), node.x, node.y);
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    animationRef.current = requestAnimationFrame(draw);
    
    // Handle canvas clicks
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if clicked on a node
      const clickedNodeIndex = nodes.findIndex(node => 
        Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 20
      );
      
      if (clickedNodeIndex !== -1) {
        const clickedNode = nodes[clickedNodeIndex];
        
        if (selectedNode === null) {
          // First node selection
          setSelectedNode(clickedNode.id);
        } else if (selectedNode === clickedNode.id) {
          // Deselect if clicking the same node
          setSelectedNode(null);
        } else {
          // Connect nodes
          const fromNode = nodes.find(n => n.id === selectedNode);
          const toNode = clickedNode;
          
          if (fromNode && toNode) {
            // Check if valid connection (data -> ai -> output)
            let isValid = false;
            
            if (fromNode.type === 'data' && toNode.type === 'ai') {
              isValid = true;
            } else if (fromNode.type === 'ai' && toNode.type === 'output') {
              // Check if the AI node is already connected to a data node
              const aiHasDataInput = connections.some(
                conn => conn.to === fromNode.id && 
                nodes.find(n => n.id === conn.from)?.type === 'data'
              );
              isValid = aiHasDataInput;
            }
            
            // Add connection if not already exists
            const connectionExists = connections.some(
              conn => (conn.from === fromNode.id && conn.to === toNode.id) || 
                     (conn.from === toNode.id && conn.to === fromNode.id)
            );
            
            if (!connectionExists) {
              const newConnection = {
                from: fromNode.id,
                to: toNode.id,
                valid: isValid
              };
              
              setConnections(prev => [...prev, newConnection]);
              
              // Update node connected status
              setNodes(prev => prev.map(node => {
                if (node.id === fromNode.id || node.id === toNode.id) {
                  return { ...node, connected: true };
                }
                return node;
              }));
              
              // Update score
              if (isValid) {
                setScore(prev => prev + 10);
                
                // Check if completed a full data -> ai -> output chain
                if (toNode.type === 'output') {
                  const aiNode = fromNode; // The fromNode is the AI in this case
                  const dataToAiConnection = connections.find(
                    conn => conn.to === aiNode.id && 
                    nodes.find(n => n.id === conn.from)?.type === 'data'
                  );
                  
                  if (dataToAiConnection) {
                    // Completed a chain!
                    setScore(prev => prev + 20); // Bonus for completing a chain
                  }
                }
              }
            }
            
            setSelectedNode(null);
          }
        }
      }
    };
    
    canvas.addEventListener('click', handleCanvasClick);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      canvas.removeEventListener('click', handleCanvasClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, nodes, connections, selectedNode]);

  const initializeGame = () => {
    // Create nodes
    const newNodes: Node[] = [];
    const canvasWidth = canvasRef.current?.clientWidth || 600;
    const canvasHeight = canvasRef.current?.clientHeight || 400;
    
    // Create data nodes (left side)
    for (let i = 0; i < 3; i++) {
      newNodes.push({
        id: i,
        x: canvasWidth * 0.2,
        y: canvasHeight * (0.25 + i * 0.25),
        type: 'data',
        connected: false
      });
    }
    
    // Create AI nodes (middle)
    for (let i = 0; i < 3; i++) {
      newNodes.push({
        id: i + 3,
        x: canvasWidth * 0.5,
        y: canvasHeight * (0.25 + i * 0.25),
        type: 'ai',
        connected: false
      });
    }
    
    // Create output nodes (right side)
    for (let i = 0; i < 3; i++) {
      newNodes.push({
        id: i + 6,
        x: canvasWidth * 0.8,
        y: canvasHeight * (0.25 + i * 0.25),
        type: 'output',
        connected: false
      });
    }
    
    setNodes(newNodes);
    setConnections([]);
    setSelectedNode(null);
    setScore(0);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
  };

  const endGame = () => {
    setGameCompleted(true);
    onComplete(score);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
    setTimeLeft(60);
    setConnections([]);
    setSelectedNode(null);
  };

  if (!gameStarted) {
    return (
      <div className="tech-card p-8 text-center">
        <h3 className="text-2xl font-bold mb-6 text-secondary">AI Connection Challenge</h3>
        <p className="mb-6">
          Connect data sources to AI nodes, and AI nodes to output nodes to create functioning AI systems. 
          Valid connections earn points, and completing full data → AI → output chains earns bonus points!
        </p>
        <button onClick={startGame} className="glow-button">Start Game</button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="tech-card p-8 text-center">
        <h3 className="text-2xl font-bold mb-6 text-secondary">Game Completed!</h3>
        <p className="text-xl mb-4">Your Score: <span className="text-accent font-bold">{score}</span></p>
        
        {score >= 100 ? (
          <p className="mb-6">Amazing! You're a natural at AI systems architecture!</p>
        ) : score >= 50 ? (
          <p className="mb-6">Great job! You've demonstrated good understanding of AI connections.</p>
        ) : (
          <p className="mb-6">Good effort! With practice, you'll master AI system design.</p>
        )}
        
        <button onClick={resetGame} className="glow-button">Play Again</button>
      </div>
    );
  }

  return (
    <div className="tech-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-secondary">AI Connection Challenge</h3>
        <div className="flex items-center space-x-4">
          <div className="bg-background/50 px-4 py-2 rounded-full border border-circuit-color">
            <span className={timeLeft <= 10 ? "text-accent" : "text-foreground"}>Time: {timeLeft}s</span>
          </div>
          <div className="bg-background/50 px-4 py-2 rounded-full border border-circuit-color">
            <span className="text-secondary">Score: {score}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-4 text-sm">
        <p>Connect: <span className="text-blue-400">DATA</span> → <span className="text-amber-500">AI</span> → <span className="text-green-400">OUTPUT</span></p>
      </div>
      
      <div className="relative border border-circuit-color rounded-lg overflow-hidden" style={{ height: '400px' }}>
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
      </div>
    </div>
  );
};

export default AIConnectionGame;
