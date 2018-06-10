// pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    question: [],
    code: [],
    hascode:false,
    isCollect:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: "https://fyspace.cn/algorithmWeb/question_action?q_id=" + options.q_id,
      success: (res) => {
        that.setData({ question: res.data });
        //获取是否收藏
        try {
          var value = wx.getStorageSync('question' + that.data.question[0].q_id)
          if (value) {
            console.log("取到")
            that.setData({ isCollect: true });
          }
        } catch (e) {
          console.log('异常');
          that.setData({ isCollect: false });
        }

      },
      fail: (res) => {
        that.setData({ question: [] });
      }
    });

  },
  onCollected:function(){
    if (this.data.isCollect){
      try {
        wx.removeStorageSync('question' + this.data.question[0].q_id);
        this.setData({
          isCollect: false
        });
        wx.showToast({
          title: '取消收藏',
          icon: 'success',
          duration: 1000
        });
      } catch (e) {
        wx.showToast({
            title: '取消失败，请重试',
            icon: 'success',
            duration: 1000
          });
      }
    }else{
      try {
        wx.setStorageSync('question' + this.data.question[0].q_id, this.data.question[0]);
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 1000
        });
        this.setData({
          isCollect: true
        });
      } catch (e) {
        wx.showToast({
          title: '收藏失败，请重试',
          icon: 'success',
          duration: 1000
        });
      }
      
    }
    
  },
  getCode:function(){

    wx.showToast({
      title: '正在加载',
      icon: 'loading',
      duration: 5000
    });
    var that = this;
    wx.request({
      url: "https://fyspace.cn/algorithmWeb/code_action?q_id=" + that.data.question[0].q_id,

      success: (res) => {
        if (res.data[0] != null && res.data[0].c_code_content != ""){
          console.log(res.data);
          that.setData({
            code: res.data,
            hascode: true
          });
          wx.showToast({
            title: '加载完成',
            icon: 'success',
            duration: 1000
          });
        }else{
          wx.showToast({
            title: '该题没有代码',
            icon: 'success',
            duration: 1000
          });
        }
       
      },
      fail: (res) => {
        that.setData({ code: [] });
      }
    });

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})