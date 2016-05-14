


var tabList = [
  {'id': 1, 'name': 'Travels', 'url': '/travels' },
  {'id': 2, 'name': 'Summary', 'url': '/summary' },
  {'id': 3, 'name': 'Calendar', 'url': '/calendar' },
  {'id': 4, 'name': 'Settings', 'url': '/settings' }
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


var Content = React.createClass({
    render: function(){
        return(
            <div className="content">
                {this.props.currentTab === 1 ?
                <div className="travels">
                  <div className="header">
                    <div className="title">Travels</div>
                  </div>


                </div>
                :null}

                {this.props.currentTab === 2 ?
                <div className="summary">
                  <div className="header">
                    <div className="title">Summary</div>

                  </div>
                </div>
                :null}

                {this.props.currentTab === 3 ?
                <div className="calendar">
                  <div className="header">
                    <div className="title">Calendar</div>
                  </div>
                </div>
                :null}

                {this.props.currentTab === 4 ?
                <div className="settings">
                  <div className="header">
                    <div className="title">Calendar</div>
                  </div>
                </div>
                :null}
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
        <Content currentTab={this.state.currentTab}/>
      </div>
    );
  }
});

ReactDOM.render(
    <Dashboard/>,
    document.getElementById('dashboard')
);
