var websocket = null;
//判断当前浏览器是否支持WebSocket
if ('WebSocket' in window) {
    //本地：ws://localhost:6060/setcard 部署：ws://localhost:6060/setcard
    websocket = new WebSocket("ws://localhost:6060/setcard");
}else {
    alert('当前浏览器 Not support websocket')
}

//连接发生错误的回调方法
websocket.onerror = function () {
    console.log("WebSocket连接发生错误");
};

//连接成功建立的回调方法
websocket.onopen = function () {
    console.log("WebSocket连接成功");
};

//接收到消息的回调方法
websocket.onmessage = function (event) {
    displayMsg(event.data);
};
//将消息显示在网页上
function displayMsg(innerHtml) {
    var msg = JSON.parse(innerHtml);
    if (msg.erro!=null) {
        localStorage.clear();
        localStorage.setItem('erro', innerHtml);
    }
console.log(msg);

/*var my_pageNum=1;*/
    function getData(){
    $.ajax({
            url:"",
            type:"GET",
            data:{
                /*pageNum:my_pageNum,
                pageSize:5*/
            },
            success:function(data){
                console.log(data);
                var html="";
                for(var i=0;i<data.users.length;i++){      
                console.log(data.users.length);
                html+=
                `   <tr>
                    <td>${data.users[i].id}</td>
                    <td>${data.users[i].name}</td>
                    <td>
                <button data-toggle="modal" data-target="#removeModal" class="btn btn-default btn-xs glyphicon glyphicon-remove">删除</button>
                <button class="btn btn-default btn-xs glyphicon glyphicon-edit">编辑</button>
                    </td>
                    </tr>
                `;
             }  
            $('#tbody').html(html);
            /*//计算总页数
            var totalPage=Math.ceil(data.total/data.pageSize)
            //设置总页数
            $('.pagination li:eq(3) a').html(totalPage);
            //设置当前页
            $('.pagination li:eq(1) a').html(data.pageNum);
            
            //添加禁用的类,如果是最后一页
            if(my_pageNum==totalPage){
                $('a[aria-label="Next"]').addClass('disabled');
            }else{
                //如果不是最后一页
                $('a[aria-label="Next"]').removeClass('disabled');
            }
            
            //添加禁用的类,如果是第一页
            if(my_pageNum==1){
                $('a[aria-label="Previous"]').addClass('disabled');
            }else{
                //如果不是第一页
                $('a[aria-label="Previous"]').removeClass('disabled');
            }*/
            }
        })
    } 
//获取后台数据
$(function(){
    getData();

/*//页码++
$('a[aria-label="Next"]').click(function(){
    if($(this).hasClass('disabled')==true){
        alert("没了");
        return;
    }
    //页码++
    my_pageNum++;
    //获取数据
    getData();
})
//页码--
$('a[aria-label="Previous"]').click(function(){
    if($(this).hasClass('disabled')==true){
        alert("没了");
        return;
    }
    //页码--
    my_pageNum--;
    //获取数据
    getData();
})*/   
//删除操作，为tbody绑定点击事件，指定删除按钮触发
var removeId;
$('tbody').on('click','.glyphicon-remove',function(){
    console.log("你点我了");
    console.log($(this));//看删除按钮
    //要拿到当前行的序号
    //老爸 的 兄弟们 的 第一个 的内容
    removeId=$(this).parent().siblings().first().html();
    console.log(removeId);
})
$('#removeModal .btn-primary').click(function(){
    console.log('删除'+removeId);
    $.ajax({
        url:"",
        type:"post",
        data:{
            id:removeId
        },
        success:function(data){
            console.log(data);//这里的data是后台返回的消息
            //刷新后台数据
            getData();
        }
    })
})
//添加操作
var datas = $("#addModal form").serializeArray();
    var d = {};//声明一个对象
    $.each(datas,function(index,data){
    d[data.name] = data.value;//通过变量，将属性值，属性一起放到对象中
})
    //等遍历结束，就会生成一个json对象了

    //如果需要对象与字符串的转换
    //这是从json对象 向 json 字符串转换
    var str1 = JSON.stringify(d);
    console.log(str1); 
$('#addModal .btn-primary').click(function(){
    $.ajax({
        url:"",
        type:"post",
        //$("#addModal form").serialize()格式化后的结果是
        //key=value&key1=value1...
        data:/*$("#addModal form").serialize()*/str1,
        success:function(data){
            console.log(data);//这里的data是后台返回的消息
            //刷新后台数据
            getData();
        }
    })
})
//编辑操作
$('tbody').on('click','.glyphicon-edit',function(){
    //要拿到当前行的序号
    //老爸 的 兄弟们 的 第一个 的内容
    var editId=$(this).parent().siblings().first().html();
    console.log(editId);
    //后台要数据
    $.ajax({
        url:"",
        data:{
            id:editId
        },
        success:function(data){
            console.log(data);//这里的data是后台返回的消息
            //修改弹框中的内容
            $('#editModal form input[name=id]').val(data.users[0].id);
            $('#editModal form input[name=name]').val(data.users[0].name);
            //弹出编辑框
            $('#editModal').modal('show');             
        }
    })  
})
//编辑后提交更改
$('#editModal .btn-primary').click(function(){
    var sendData=$('#editModal form').serialize();
    $.ajax({
        url:"",
        type:"post",
        data:sendData,
        success:function(data){
            console.log(data);//这里的data是后台返回的消息
            //刷新后台数据
            getData();
        }
    })
})
})
}
//连接关闭的回调方法
websocket.onclose = function () {
    console.log("WebSocket连接关闭");
}   

//监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
window.onbeforeunload = function () {
    closeWebSocket();
}

//关闭WebSocket连接
function closeWebSocket() {
    websocket.close();
}

