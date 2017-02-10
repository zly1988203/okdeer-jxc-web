
function save() {
	$('#saveBrand').attr("disabled","disabled");
	var isValid = $("#formAdd").form('validate');
	if (!isValid) {
		$('#saveBrand').removeAttr("disabled");
		return;
	}
	var formObj = $('#formAdd').serializeObject();
	$.ajax({
		url : contextPath + "/common/brand/saveBrand",
		type : "POST",
		data : formObj,
		success : function(result) {
			if(result.code == 0){
				alertTip(result.message, initDataGrid);
				var flag = $("input[type='checkbox']").is(':checked');
				if(flag){
					$('#saveBrand').removeAttr("disabled");
					cleanForm();
				}else{
					closeDialogHandel();
				}
			}else{
				$('#saveBrand').removeAttr("disabled");
				alertTip(result.message);
			}
		},
		error : function(result) {
			successTip("请求发送失败或服务器处理失败");
		}
	});
}

//清空表单
function cleanForm(){
	$("#brandCode").val('');
	$("#brandName").val('');
	$("#remark").val('');
}

//关闭属性编辑窗口
function closeDialogHandel(){
    if(addDalogTemp){
        $(addDalogTemp).panel('destroy');
    }
}