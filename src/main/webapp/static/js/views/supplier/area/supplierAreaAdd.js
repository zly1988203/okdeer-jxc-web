/**
 * Created by huangj02 on 2016/10/12.
 */

/**
 * 保存
 */
function saveHandel(){
   //验证数据
    if(!$("#formAdd").form('validate')){
        return;
    }
    var formData = $('#formAdd').serializeObject();
    $.ajax({
        type:"POST",
        url:contextPath+"/supplierArea/addForm",
        data:formData,
        success:function(data){
            if(data.code == 0){
                reloadListHandel();
                $.messager.alert('提示',"保存成功");
            }else{
                $.messager.alert('提示',data.message);
            }
        },
        error:function(e){

        }
    })

}