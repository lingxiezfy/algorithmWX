//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    curr_page:1,
    page_size:10,
    s_id:0,
    search_value:'',
    _s:0,
    downRefresh:0,
    userInfo: {},
    newData:[],
    sourceList: [{ "s_id": 0, "s_name": "全部来源" }],
    questionList:[],
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  clearSearchValue:function(){
    this.setData({
      search_value: ''
    });
    this.getQuestionData();
  },
  onSourceSelected:function(e){
    console.log(e);
    this.setData({
      _s:e.target.dataset.s,
      s_id: e.currentTarget.id
    })
    wx.request({
      url: "http://192.168.43.33:8080/algorithm/question_list_action?curr_page=" + this.data.curr_page + "&page_size=" + this.data.page_size + "&s_id=" + this.data.s_id + "&search_value=" + this.data.search_value,
      success: (res) => {
        this.setData({ questionList: res.data });
      },
      fail: (res) => {
        this.setData({ questionList: [] });
      },
      complete: () => {

      }
    });
  },
  viewQuestion:function(e){
    console.log(e)
    wx.navigateTo({
      url: '../question/question?q_id=' + e.currentTarget.id
    })
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (options && options.searchValue){
      this.setData({
        search_value: options.searchValue
      });
    }
    this.getQuestionData();
    this.getSourceData();
  },
  getQuestionData:function(){
    wx.request({
      url: "http://192.168.43.33:8080/algorithm/question_list_action?curr_page=1"+ "&page_size=" + this.data.page_size + "&s_id=" + this.data.s_id + "&search_value=" + this.data.search_value,
      success: (res) => {
        this.setData({ questionList: res.data });
      },
      fail: (res) => {
        this.setData({ questionList: [] });
      },
      complete: () => {

      }
    });
    
  },
  getSourceData:function(){
    var initData = this.data.sourceList;
    wx.request({
      url: 'http://192.168.43.33:8080/algorithm/source_list_action',
      success: (res) => {
        initData = initData.concat(res.data);
        console.log(initData);
        this.setData({
          sourceList: initData
        });
      }
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },
  onPullDownRefresh: function () {
    console.log('下拉刷新');
    this.setData({
      downRefresh: 0
    });
    this.getQuestionData();
    wx.stopPullDownRefresh;
  },
  onReachBottom: function () {
    console.log('上拉加载');
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      mask:true,
      duration: 5000
    });
    
    var currPage = this.data.curr_page;
    if (this.data.questionList.length < currPage * this.data.page_size){
      //没有更多数据了
      wx.showToast({
        title: '没有更多数据了',
        icon: 'success',
        duration: 1000
      });
    }else{
      var newData = [];
      var nextPage = currPage + 1;
      console.log(nextPage);
      wx.request({
        url: "http://192.168.43.33:8080/algorithm/question_list_action?curr_page=" + nextPage + "&page_size=" + this.data.page_size + "&s_id=" + this.data.s_id + "&search_value=" + this.data.search_value,
        success: (res) => {
          newData = res.data;
        },
        complete: () => {
          console.log(newData);
          if (newData.length >0){
            var questionList = this.data.questionList;
            this.setData({
              curr_page:nextPage,
              questionList:questionList.concat(newData)
            });
            wx.showToast({
              title: '加载完成',
              icon: 'success',
              duration: 2000
            });

          }else{
            wx.showToast({
              title: '没有更多数据了',
              icon: 'success',
              duration: 1000
            });
          }
      }
      });

    }
    
    
  }
})
