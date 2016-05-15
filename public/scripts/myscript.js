//var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
// var ReactCSSTransitionGroup = require('react-addons-css-transition-group');


var tabList = [
  {'id': 1, 'name': 'travels', 'url': '/travels' },
  {'id': 2, 'name': 'summary', 'url': '/summary' },
  {'id': 3, 'name': 'calendar', 'url': '/calendar' },
  {'id': 4, 'name': 'settings', 'url': '/settings' }
];



var Tab = React.createClass({
  handleClick: function(e){
    e.preventDefault();
    this.props.handleClick();
  },

  render: function(){
    return (
      <li className={this.props.isCurrent ? 'current' : null}>
        <a onClick={this.handleClick} href={this.props.url}>
          {this.props.name}
        </a>
      </li>
    );
  }
});


var Navigation = React.createClass({
  handleClick: function(tab){
    this.props.changeTab(tab);
  },


  render: function(){
    return (
      <nav>
        <ul>
          {this.props.tabList.map(function(tab){
            return (
              <Tab
                handleClick={this.handleClick.bind(this, tab)}
                key={tab.id}
                url={tab.url}
                name={tab.name}
                isCurrent={(this.props.currentTab === tab.id)}
              />
            );
          }.bind(this))}
        </ul>
      </nav>
    );
  }
});

var Travels = React.createClass({
    render: function(){
        return(
            <div className="module">

            </div>
        );
    }
});

var Content = React.createClass({
    render: function(){
        return(
            <div className="content">
              
                <div className={this.props.tabList[this.props.currentTab-1].name}>
                  <div className="header">
                      <div className="title">{this.props.tabList[this.props.currentTab-1].name}</div>
                  </div>
                </div>
            </div>
        );
    }
});


var Dashboard = React.createClass({

  getInitialState: function() {

    return {tabList:tabList, currentTab: 1};
  },


  changeTab: function(tab){
    this.setState({currentTab: tab.id});
  },

  render: function() {
    return (
      <div>
        <Navigation
          currentTab = {this.state.currentTab}
          tabList={this.state.tabList}
          changeTab={this.changeTab}
        />
        <Content currentTab={this.state.currentTab} tabList={this.state.tabList}/>
      </div>
    );
  }
});

ReactDOM.render(
    <Dashboard/>,
    document.getElementById('dashboard')
);
