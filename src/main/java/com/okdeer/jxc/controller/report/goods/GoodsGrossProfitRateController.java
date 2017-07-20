/** 
 *@Project: okdeer-jxc-web 
 *@Author: zuowm
 *@Date: 2017年7月13日 
 *@Copyright: ©2014-2020 www.okdeer.com Inc. All rights reserved. 
 */
package com.okdeer.jxc.controller.report.goods;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.dubbo.config.annotation.Reference;
import com.okdeer.jxc.common.constant.ExportExcelConstant;
import com.okdeer.jxc.common.result.RespJson;
import com.okdeer.jxc.common.utils.DateUtils;
import com.okdeer.jxc.controller.BaseController;
import com.okdeer.retail.common.page.PageUtils;
import com.okdeer.retail.facade.report.entity.GoodsGrossProfitRate;
import com.okdeer.retail.facade.report.facade.GoodsGrossProfitRateFacade;
import com.okdeer.retail.facade.report.qo.GoodsGrossProfitRateQo;

/**
 * ClassName: goodsGrossProfitRateController 
 * @Description: 商品毛利率controller
 * @author zuowm
 * @date 2017年7月13日
 *
 * =================================================================================================
 *     Task ID			  Date			     Author		      Description
 * ----------------+----------------+-------------------+-------------------------------------------
 *
 */
@Controller
@RequestMapping("/report/goodsGrossProfitRate")
public class GoodsGrossProfitRateController extends BaseController<GoodsGrossProfitRateController> {

	/**
	 * 商品毛利率
	 */
	@Reference(version = "1.0.0", check = false)
	GoodsGrossProfitRateFacade goodsGrossProfitRateFacade;

	/**
	 * @Description: 跳转页面
	 * @param model
	 * @return
	 * @author zuowm
	 * @date 2017年7月13日
	 */
	@RequestMapping
	public String index() {
		LOG.info("GoodsGrossProfitRateController start....");
		return "report/goods/goodsGrossProfitRate";
	}

	/**
	 * @Description: 商品毛利率报表
	 * @param qo 查询系统按键
	 * @param pageNumber 页码
	 * @param pageSize 每页条数 
	 * @return 每页数据
	 * @author zuowm
	 * @date 2017年7月13日
	 */
	@RequestMapping("/list")
	@ResponseBody
	public PageUtils<GoodsGrossProfitRate> list(GoodsGrossProfitRateQo qo,
			@RequestParam(value = "page", defaultValue = PAGE_NO) int pageNumber,
			@RequestParam(value = "rows", defaultValue = PAGE_SIZE) int pageSize) {
		LOG.info("GoodsGrossProfitRateController.list start....");
		LOG.debug("商品毛利率报表查询条件：{}", qo);
		try {
			qo.setPageNum(pageNumber);
			qo.setPageSize(pageSize);
			qo.setBizType(0);
			qo.setStartTime(DateUtils.getFullStr(DateUtils.parse(qo.getStartTime() + " 00:00:00")));
			qo.setEndTime(DateUtils.getFullStr(DateUtils.getNextDay(DateUtils.parse(qo.getEndTime() + " 00:00:00"))));

			PageUtils<GoodsGrossProfitRate> page = goodsGrossProfitRateFacade.queryGoodsGrossProfitRateList(qo);
			LOG.debug("商品毛利率报表查询结果：{}", page);
			return page;
		} catch (Exception e) {
			LOG.error("统计商品毛利数据错误：{}", e);
		}
		return PageUtils.emptyPage();
	}

	@RequestMapping(value = "/exportList", method = RequestMethod.POST)
	@ResponseBody
	public RespJson exportList(HttpServletResponse response, GoodsGrossProfitRateQo qo) {

		LOG.info("GoodsGrossProfitRateController.exportList start....");
		try {
			qo.setBizType(1);
			qo.setStartTime(DateUtils.getFullStr(DateUtils.parse(qo.getStartTime() + " 00:00:00")));
			qo.setEndTime(DateUtils.getFullStr(DateUtils.getNextDay(DateUtils.parse(qo.getEndTime() + " 00:00:00"))));

			List<GoodsGrossProfitRate> list = goodsGrossProfitRateFacade.queryGoodsGrossProfitRateExportList(qo);

			if (CollectionUtils.isNotEmpty(list)) {
				String fileName = "商品毛利率报表" + "_" + DateUtils.getCurrSmallStr();

				String templateName = ExportExcelConstant.GOODS_GROSS_PROFIT_RATE;
				exportListForXLSX(response, list, fileName, templateName);
			} else {
				RespJson json = RespJson.error("无数据可导");
				return json;
			}
		} catch (Exception e) {
			LOG.error("GoodsGrossProfitRateController.exportList Exception:", e);
			RespJson json = RespJson.error("导出失败");
			return json;
		}
		return null;
	}
}
