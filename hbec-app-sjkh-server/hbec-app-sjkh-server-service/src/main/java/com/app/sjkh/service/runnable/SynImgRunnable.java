package com.app.sjkh.service.runnable;

import com.app.sjkh.commons.servier.ToukerApiService;
import com.app.sjkh.commons.utils.DateUtils;
import com.app.sjkh.commons.vo.Constants;
import com.app.sjkh.commons.vo.ResultCode;
import com.app.sjkh.commons.vo.ResultResponse;
import com.app.sjkh.pojo.local.AcceptedMediaUrl;
import com.app.sjkh.service.example.AcceptedMediaUrlService;
import com.app.sjkh.service.example.impl.AcceptedMediaUrlServiceImpl;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.util.Date;

public class SynImgRunnable implements Runnable {
    private static final Log logger = LogFactory.getLog(SynImgRunnable.class);

    private String userId;
    private String toukerId;
    private String imgflag;
    private ToukerApiService toukerApiService;
    private AcceptedMediaUrlService acceptedMediaUrlService;

    public SynImgRunnable(String userID, String toukerId, String imgflag,
                          ToukerApiService toukerApiService, AcceptedMediaUrlServiceImpl acceptedMediaUrlService) {
        this.userId = userID;
        this.toukerId = toukerId;
        this.imgflag = imgflag;
        this.toukerApiService = toukerApiService;
        this.acceptedMediaUrlService = acceptedMediaUrlService;
    }

    /**
     * 后续由于账户系统已经将身份证图片进行了缩放处理，这边就不用缩放处理了
     * byte[] bb = decoder.decodeBuffer(base64Str);
     * Image img = ImageIO.read(new ByteArrayInputStream(bb));
     * String outputFileName = SSOService.getImgDir() + System.currentTimeMillis() + ".jpg";
     * //生成缩放图片
     * compressPic(img, outputFileName);
     * //将缩放的图片转为base64串进行存储
     * File  file = new File(outputFileName);
     * FileInputStream inputFile = new FileInputStream(outputFileName);
     * byte[] buffer = new byte[(int)file.length()];
     * inputFile.read(buffer);
     * inputFile.close();
     * String base64 = new BASE64Encoder().encode(buffer);
     */
    @Override
    public void run() {
        try {

            logger.info("线程同步照片  toukerId=" + toukerId + " imgflag=" + imgflag);
            ResultResponse resultResponse = toukerApiService.uploadServiceGetFileBytes(Constants.CERT_PIC_ROOT_PATH, toukerId + "_" + imgflag);

            //将base64串存储到数据库中
            String media_Id = "5005";
            if (Constants.CERT_PIC_FRONT.equals(imgflag)) {
                media_Id = "5005";
            } else if (Constants.CERT_PIC_BACK.equals(imgflag)) {
                media_Id = "5006";
            }
            //添加或者更新身份证影像
            if (ResultCode.HBEC_000000.getCode().equals(resultResponse.getStatus())) {
                addMediaImgInfo(media_Id, resultResponse.getData().toString());
                logger.info("已存在影像信息同步到开户系统中");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }




    /**
     * @throws Exception
     * @describe: TODO(添加或者更新客户的身份证媒体信息)
     * @params:
     * @author: xujianhua@touker.com
     * @datetime:2016-1-5 下午02:20:46
     */
    public void addMediaImgInfo(String media_Id, String base64Str) throws Exception {
        String id = acceptedMediaUrlService.querySequence();
        AcceptedMediaUrl bean = new AcceptedMediaUrl();
        bean.setUserid(userId);
        bean.setMediaId(media_Id);
        AcceptedMediaUrl acceptedMediaUrl = acceptedMediaUrlService.queryOneByWhere(bean);
        if (null == acceptedMediaUrl) {    //如果为空则新插入
            ///webUpload/takePhoto/20150416/102146/cert/5005.jpg?id=9327
            String mediaUrl = Constants.IMG_MEDIAPATH + "/" + DateUtils.convertDateIntoYYYYMMDDStr(new Date()) + "/" + userId + "/cert/" + media_Id + ".jpg?id=" + id;
            AcceptedMediaUrl newBean = new AcceptedMediaUrl();
            newBean.setId(id);
            newBean.setUserid(userId);
            newBean.setMediaId(media_Id);
            newBean.setMediaurl(mediaUrl);
            newBean.setCreateDate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            newBean.setUpdateDate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            newBean.setMediaContent(base64Str);
            newBean.setImgType(media_Id);
            acceptedMediaUrlService.save(newBean);
            logger.info("拉取客户身份证保存成功");
        } else {    //更新
            bean.setCreateDate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            bean.setUpdateDate(DateUtils.convertDateIntoYYYYMMDD_HHCMMCSSStr(new Date()));
            bean.setMediaContent(base64Str);
            bean.setId(acceptedMediaUrl.getId());

            acceptedMediaUrlService.updateSelective(bean);
        }
    }
}
