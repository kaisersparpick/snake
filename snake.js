(() => {
  const game = document.getElementById('game'), grid = document.getElementById('grid');
  const rows = 10, cols = 30;
  const dirs = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' };
  const byArr = arr => e => e[0] === arr[0] && e[1] === arr[1];
  const rnd = (min, max) => Math.floor(Math.random() * max) + min;
  const rndPos = taken => {
    let pos;
    do { pos = [rnd(0,rows), rnd(0,cols)] } while (taken.findIndex(byArr(pos)) !== -1);
    return pos;
  };
  let dir = 'U', score = 0, int;
  const matrix = new Array(rows).fill('').map(x => new Array(cols).fill('∙'));
  const snake = [ [3, 14], [4, 14], [5, 14] ];
  const food = [ rndPos(snake), rndPos(snake) ];
  const say = msg => game.innerHTML = (msg.padEnd(20) + 'score: ' + score);
  const empty = pos => matrix[pos[0]][pos[1]] = '∙';
  const draw = end => {
    snake.forEach(([r, c]) => matrix[r][c] = '●');
    if (end) matrix[snake[0][0]][snake[0][1]] = 'X';
    food.forEach(([r, c]) => matrix[r][c] = '○');
    grid.innerHTML = matrix.reduce((txt, row) => txt + row.join('') + '\n', '');
    say(end ? 'GAME OVER' : 'Snake');
  }
  const gameOver = () => {
    draw(true);
    clearInterval(int);
  };
  const eat = foodIdx => {
    food.splice(foodIdx, 1);
    food.push(rndPos([...snake, ...food]));
    score++;
  };
  const move = () => {
    const [r, c] = snake[0];
    const npos
       = dir === 'U' ? [ r-1, c ] : dir === 'D' ? [ r+1, c ]
       : dir === 'L' ? [ r, c-1 ] : dir === 'R' ? [ r, c+1 ] : null;
    if (
      (npos[0] === -1 || npos[1] === -1 || npos[0] === rows || npos[1] === cols)
      || snake.findIndex(byArr(npos)) !== -1
    ) return gameOver(int);

    const foodIdx = food.findIndex(byArr(npos));
    foodIdx !== -1 ? eat(foodIdx) : empty(snake.pop());
    snake.unshift(npos);
    draw();
  };
  window.addEventListener('keydown', e => {
    if (!int) int = setInterval(() => move(), 150);
    const ndir = dirs[e.key];
    if (!ndir || dir === ndir) return;
    dir = ndir;
  });
  draw();
})();