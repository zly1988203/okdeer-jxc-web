/** 
 *@Project: okdeer-jxc-web 
 *@Author: liux01
 *@Date: 2016年10月25日 
 *@Copyright: ©2014-2020 www.yschome.com Inc. All rights reserved. 
 */    
package com.okdeer.jxc.controller.report;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.LogConstant;
import com.okdeer.jxc.common.utils.PageUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.jxc.report.service.CategorySaleReportServiceApi;
import com.okdeer.jxc.report.vo.CategorySaleReportVo;
import com.okdeer.jxc.utils.UserUtil;


/**
 * ClassName: CategorySaleController 
 * @Description: TODO
 * @author liux01
 * @date 2016年10月25日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *    
 */
@Controller
@RequestMapping("categorySale/report")
public class CategorySaleController extends BaseController<CategorySaleController> {
	@Reference(version = "1.0.0", check = false)
	private CategorySaleReportServiceApi categorySaleReportServiceApi;
	
	@RequestMapping(value = "/list")
	public String list(){
		return "/report/retail/categorySaleReport";
	}
	/**
	 * 
	 * @Description: 获取店铺列表销售汇总情况信息
	 * @param vo 入参
	 * @param pageNumber 页数
	 * @param pageSize 每页显示数
	 * @return
	 * @author liux01
	 * @date 2016年10月26日
	 */
	@RequestMapping(value = "getCategorySaleList", method = RequestMethod.POST)
	@ResponseBody
	public PageUtils<CategorySaleReportVo> getCategorySaleList(
			CategorySaleReportVo vo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info(LogConstant.OUT_PARAM, vo.toString());
		try {
			vo.setPageNumber(pageNumber);
			vo.setPageSize(pageSize);
			vo.setSourceBranchId(UserUtil.getCurrBranchId());
			PageUtils<CategorySaleReportVo> goodsSaleReportList = categorySaleReportServiceApi.getCategorySaleList(vo);
			LOG.info(LogConstant.PAGE, goodsSaleReportList.toString());
			return goodsSaleReportList;
		} catch (Exception e) {
			LOG.error("类别销售列表信息异常:{}", e);
		}
		return null;
	}
}
