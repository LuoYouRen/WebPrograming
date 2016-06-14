const eggNumber = 10;
function Egg(snake,scene){
	this.scene = scene;
	this.position = new Array(3);
	this.setPosition();
	this.sphere;
	this.draw(snake,scene);
}
//重新設定蛋的位置
Egg.prototype.setPosition = function(){
	this.position[0] = Math.floor(Math.random()*17)-8;
	this.position[1] = Math.floor(Math.random()*17)-8;
	this.position[2] = Math.floor(Math.random()*17)-8;
	
	if(Math.abs(this.position[0])!=edge 
	&& Math.abs(this.position[1])!=edge 
	&& Math.abs(this.position[2])!=edge){
		this.setPosition();
	}else if(Math.abs(this.position[0])==edge && Math.abs(this.position[1])==edge){
		this.setPosition();
	}else if(Math.abs(this.position[0])==edge && Math.abs(this.position[2])==edge){
		this.setPosition();
	}else if(Math.abs(this.position[1])==edge && Math.abs(this.position[2])==edge){
		this.setPosition();
	}
}
//畫出蛋
Egg.prototype.draw = function(snake){
	
	var materialEgg = new BABYLON.StandardMaterial("egg", this.scene);
	materialEgg.diffuseColor = new BABYLON.Color3(1, 1, 1);//white
	this.sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 0.79999995, this.scene);
	this.sphere.material = materialEgg;
	this.sphere.position = new BABYLON.Vector3(this.position[0], this.position[1], this.position[2]);
	this.sphere.actionManager = new BABYLON.ActionManager(this.scene);
	for(var i = 0 ; i < snake.cube.length ; i++){
		
		snake.cube[i].actionManager.registerAction(new BABYLON.SetValueAction(
        { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: this.sphere },
        snake.cube[i], "scaling", new BABYLON.Vector3(1.2, 1.2, 1.2)));
		
		snake.cube[i].actionManager.registerAction(new BABYLON.SetValueAction(
        { trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: this.sphere },
        snake.cube[i], "scaling", new BABYLON.Vector3(1, 1, 1)));
		
	}
}
//蛋蛋的索引
function Eggs(snake,scene){
	this.snake = snake;
	this.scene = scene;
	this.array = new Array();
	this.array[0] = new Egg(snake,scene);
	this.layEgg();
	this.layEgg();
}
//重新設定蛋的位置
Eggs.prototype.reborn = function(index){
	this.array[index].setPosition();
	var length = this.array.length;
	for(var i = 0; i< length; i++){
		if(i==index)continue;
		if(this.array[i].position[0] == this.array[index].position[0] &&
			this.array[i].position[1] == this.array[index].position[1] &&
			this.array[i].position[2] == this.array[index].position[2]){
				this.array[index].setPosition();i=0;
			}
	}
	this.array[index].sphere.position = new BABYLON.Vector3(this.array[index].position[0],
		this.array[index].position[1],this.array[index].position[2]);
}
//生蛋
Eggs.prototype.layEgg = function(){
	var length = this.array.length;
	if(length >= eggNumber)return;
	this.array[length] = new Egg(this.snake,this.scene);
	this.reborn(length);
}