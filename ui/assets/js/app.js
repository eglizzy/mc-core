import angular from 'angular'
import 'angular-ui-bootstrap'
import 'angular-ui-router'
import routerAdder from './helpers/add-route'
import authInterceptor from './helpers/auth-interceptor'
import controllers from './controllers'

const app = angular.module('mission-control', [
  'ui.router',
  'ui.bootstrap'
])
const addRoute = routerAdder(app)

app.config(['$urlRouterProvider', ($urlRouterProvider) => {

  // For any unmatched url, redirect to /dashboard
  $urlRouterProvider.otherwise('/dashboard')

}])

app.config(['$httpProvider', ($httpProvider) => {

  // Automatically send credentials (cookies)
  $httpProvider.defaults.withCredentials = true
  // Register $http middleware/"interceptor" for re-authenticating
  $httpProvider.interceptors.push(authInterceptor)

}])

app.run(controllers.user)
app.run(controllers.login)

// Routes
addRoute('dashboard', '/dashboard', 'dashboard.html', controllers.dashboard)

addRoute('pipelines', '/pipelines', 'pipelines.html', controllers.pipelines)
addRoute('pipeline-execution-details', '/pipelines/executions/{id}', 'pipeline-execution-details.html', controllers.pipelineExecutionDetails)

addRoute('projects', '/projects', 'projects.html', controllers.projects)

addRoute('project', '/project/:project', '/project/project.html', controllers.project)
// addRoute('pipeline', '/project/:project/:pipeline', '/project/pipeline.html', controllers.pipeline)

addRoute('applications', '/resources/applications', '/resources/applications.html', controllers.applications)
addRoute('application-builds', '/resources/application-builds', '/resources/application-builds.html', controllers.applicationBuilds)
addRoute('servers', '/resources/servers', '/resources/servers.html', controllers.servers)
addRoute('files', '/resources/files', '/resources/files.html', controllers.files)
addRoute('credentials', '/resources/credentials', '/resources/credentials.html', controllers.credentials)
addRoute('github-repositories', '/resources/github-repositories', '/resources/github-repositories.html', controllers.githubRepositories)
addRoute('ami', '/resources/ami', '/resources/ami.html', controllers.ami)
addRoute('elb', '/resources/elb', '/resources/elb.html', controllers.elb)
addRoute('asg', '/resources/asg', '/resources/asg.html', controllers.asg)
addRoute('ec2', '/resources/ec2', '/resources/ec2.html', controllers.ec2)

addRoute('configuration', '/settings/general/configuration', '/settings/general/configuration.html', controllers.configuration)
addRoute('users', '/settings/general/users', '/settings/general/users.html', controllers.users)

addRoute('slack', '/settings/notifications/slack', '/settings/notifications/slack.html', controllers.slack)
addRoute('email', '/settings/notifications/email', '/settings/notifications/email.html', controllers.email)
