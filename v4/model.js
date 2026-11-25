// The four wall and roof panels share vertices. Project only when the angle changes.
(() => {
  const canvas = document.getElementById('tent-model');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const angle = document.getElementById('angle');
  const base = [[-1,0,1],[1,0,1],[1,0,-1],[-1,0,-1]];
  const shoulders = base.map(([x,,z]) => [x*1.09,1.35,z*1.09]);
  const peak = [0,2.05,0];
  const fabric = ['#d77833','#af5727','#ab5424','#be692e'];
  function paint() {
    const yaw = Number(angle.value)*Math.PI/180;
    function project([x,y,z]) {
      const depth = x*Math.sin(yaw)+z*Math.cos(yaw);
      return [320+94*(x*Math.cos(yaw)-z*Math.sin(yaw)),240-92*y+29*depth,depth+.31*y];
    }
    function polygon(vertices,color) {
      ctx.beginPath();
      vertices.map(project).forEach(([x,y],i)=>i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
      ctx.closePath();
      ctx.fillStyle=color;
      ctx.fill();
      ctx.strokeStyle='#392f29';
      ctx.lineWidth=2;
      ctx.stroke();
    }
    const panels=[];
    for (let i=0;i<4;i++) {
      const j=(i+1)%4;
      panels.push({vertices:[base[i],base[j],shoulders[j],shoulders[i]],color:fabric[i],wall:i});
      panels.push({vertices:[shoulders[i],shoulders[j],peak],color:['#eed6a5','#dbbb8c','#cbb18b','#e6c998'][i]});
    }
    function depth(panel) {
      return panel.vertices.reduce((sum,v)=>sum+project(v)[2],0)/panel.vertices.length;
    }
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0e171c';
    ctx.beginPath();
    ctx.ellipse(320,248,158,49,0,0,Math.PI*2);
    ctx.fill();
    panels.sort((a,b)=>depth(a)-depth(b)).forEach(panel=>{
      polygon(panel.vertices,panel.color);
      if(panel.wall===0) polygon([[-.53,.01,1],[.53,.01,1],[.5,1,1.067],[.3,1.22,1.08],[-.28,1.22,1.08],[-.5,1,1.067]],'#34414a');
      if(panel.wall===1) polygon([[1.05,.74,-.43],[1.05,.74,.43],[1.076,1.14,.43],[1.076,1.14,-.43]],'#78949c');
    });
    angle.setAttribute('aria-valuetext',angle.value+'°');
  }
  angle.addEventListener('input',paint);
  paint();
})();
