// External files import
import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Internal files import
import ViewScrapedImages from '../components/module/MediaScrap/ViewScrapedImages'

import Root from '../route/Root'

class App extends Component {

  render() {
    return (
      <Router history={createBrowserHistory}>
        <div>
          <Root>
            <Route exact path={'/'} component={ViewScrapedImages} />
          </Root>
        </div>
      </Router>
    )
  }
}

export default App