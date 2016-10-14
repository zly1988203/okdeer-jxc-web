/** 
 *@Project: okdeer-jxc-web 
 *@Author: xiaoj02
 *@Date: 2016年10月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.common.goodselect;

import java.io.InputStream;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.goods.entity.GoodsSelect;
import com.okdeer.jxc.goods.service.GoodsSelectServiceApi;
import com.okdeer.jxc.utils.poi.ExcelReaderUtil;

import net.sf.json.JSONObject;


/**
 * ClassName: GoodsSelectCompent 
 * @author xiaoj02
 * @date 2016年10月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Component
public class GoodsSelectImportComponent {
	
	private static final Logger LOG = LoggerFactory.getLogger(GoodsSelectImportComponent.class);
	
	@Reference(version = "1.0.0", check = false)
	private GoodsSelectServiceApi goodsSelectServiceApi;
	
	//采购货号导入{货号,数量，是否赠品}
	public static final String[] purchase_sku_code = {"skuCode","num","isGift"};
	//采购条码导入{条码,数量，是否赠品}
	public static final String[] purchase_bar_code = {"skuCode","num","isGift"};

	/**
	 * @author xiaoj02
	 * @date 2016年10月13日
	 */
	public <T extends GoodsSelect> GoodsSelectImportVo<T> importSelectGoods(String fileName, InputStream is, String[] fields, T entity, String branchId, String type,GoodSelectImportBusinessValid businessValid) {
		//读取excel
		List<JSONObject> excelList = ExcelReaderUtil.readExcel(fileName, is, fields);
		
		if(StringUtils.isBlank(type)){
			LOG.error("导入类型为空");
			throw new RuntimeException("导入类型为空");
		}
		
		GoodsSelectImportHandle goodsSelectImportHandle = null;
		List<GoodsSelect> dbList = null;
		
		if(type.equals(GoodsSelectImportHandle.TYPE_SKU_CODE)){//货号
			//构建数据过滤对象
			goodsSelectImportHandle = new GoodsSelectImportSkuCodeHandle(excelList, fields, businessValid);
			
			//获取已验证成功的数据的货号
			List<String> list = goodsSelectImportHandle.getExcelSuccessCode();
			
			//根据货号查询商品
			dbList = goodsSelectServiceApi.queryListBySkuCode(list.toArray(new String[list.size()]), branchId);
			
		}else if(type.equals(GoodsSelectImportHandle.TYPE_BAR_CODE)){//条码
			
			//构建数据过滤对象
			goodsSelectImportHandle = new GoodsSelectImportBarCodeHandle(excelList, fields, businessValid);
			
			//获取已验证成功的数据的条码
			List<String> list = goodsSelectImportHandle.getExcelSuccessCode();
			
			//根据条码查询商品，过滤掉条码重复的商品
			dbList = goodsSelectServiceApi.queryListByBarCode(list.toArray(new String[list.size()]), branchId);
			
		}else{
			throw new RuntimeException("导入类型不合法:\t"+type);
		}
		
		//与数据库对比,标记处该店铺中未查询到的数据
		goodsSelectImportHandle.checkWithDataBase(dbList);
		
		Integer successNum = goodsSelectImportHandle.getExcelListSuccessData().size();
		
		Integer errorNum = goodsSelectImportHandle.getExcelListErrorData().size();
		
		StringBuffer message = new StringBuffer();
		message.append("成功：");
		message.append(successNum);
		message.append("条,");
		message.append("失败：");
		message.append(errorNum);
		message.append("条。");
		
		GoodsSelectImportVo<T> goodsSelectImportVo = new GoodsSelectImportVo<T>();
		
		@SuppressWarnings("unchecked")
		List<T> successList = (List<T>) goodsSelectImportHandle.getSuccessData(dbList, fields, entity);
		
		goodsSelectImportVo.setList(successList);
		
		goodsSelectImportVo.setMessage(message.toString());
		
		goodsSelectImportVo.setErrorFileUrl("http://功能还没实现，等我下午来写");
		
		return goodsSelectImportVo;
	}
	
	

}
