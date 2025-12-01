const canvas = document.getElementById('ondas');
        const ctx = canvas.getContext('2d');

        // Ajusta o canvas: largura responsiva, altura fixa em 40px
        function resizeCanvas() {
            canvas.width = window.innerWidth * 0.95;
            canvas.height = 40; // Altura fixa conforme solicitado
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const cores = ['#046d00ff', '#0003c0ff', '#8b4513', '#008a0bff'];
        const ondas = [];
        const numOndas = 4;
        const alturaCanvas = canvas.height;
        const amplitudeMax = alturaCanvas * 0.18; // Máximo ~7px de oscilação
        const espacoVertical = alturaCanvas / (numOndas + 1);

        // Inicializa as ondas com variações suaves
        for (let i = 0; i < numOndas; i++) {
            ondas.push({
                cor: cores[i],
                offset: i * 1.5, // Offset fixo para evitar sobreposição caótica
                velocidade: 0.015 + i * 0.003, // Velocidades crescentes suaves
                frequencia: 0.008 + i * 0.0015 // Frequências diferentes para movimento orgânico
            });
        }

        let tempo = 0;

        function desenhar() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ondas.forEach((onda, index) => {
                const yBase = espacoVertical * (index + 1);
                const amplitude = amplitudeMax * (0.8 + 0.2 * Math.sin(tempo * 0.15 + index)); // Leve pulsação

                ctx.beginPath();
                ctx.moveTo(0, yBase);

                ctx.strokeStyle = onda.cor;
                ctx.lineWidth = 2.2;
                ctx.lineCap = 'round';

                // Mais pontos = mais fluidez
                for (let x = 0; x <= canvas.width; x += 1) {
                    const fase = x * onda.frequencia + tempo * onda.velocidade + onda.offset;
                    const deslocamento = Math.sin(fase) * amplitude;
                    const y = yBase + deslocamento;
                    ctx.lineTo(x, y);
                }

                ctx.stroke();
            });

            tempo += 0.05; // Animação mais suave
            requestAnimationFrame(desenhar);
        }

        desenhar();