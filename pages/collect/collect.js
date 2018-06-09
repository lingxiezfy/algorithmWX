// pages/collect/collect.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      var res = wx.getStorageInfoSync();
      var reg =/^question/;
      var tempList =[];
      console.log(res.keys)
      for(var i = 0;i<res.keys.length;i++){
        if (reg.test(res.keys[i])){
          tempList = tempList.concat(wx.getStorageSync(res.keys[i]))
        }
      }
      this.setData({
        questionList: tempList
      });
    } catch (e) {
      this.setData({
        questionList: []
      });
    }
  },
  viewQuestion: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../question/question?q_id=' + e.currentTarget.id
    })
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
   this.onLoad();
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