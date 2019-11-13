node {

	def BUILD_PARAMETERS = [ 
		bonitaEnvironment:'Qualification',
		bcdConfiguration:'integration',
		rumtime:'acme1-prd (7.10.0.beta-02)',
		verbose:false
	]

    stage("git-checkout") {
     	def checkout_result = checkout scm
     	BUILD_PARAMETERS.gitURL = checkout_result.GIT_URL
     	BUILD_PARAMETERS.gitCommit = checkout_result.GIT_COMMIT
    }
    
    stage('Build') {
    	 livingAppBuild = build(job: "livingapp-build"
                    , parameters: [
                    	string(name: 'LIVINGAPP_GIT_URL', value: BUILD_PARAMETERS.gitURL),
                    	string(name: 'LIVINGAPP_GIT_BRANCH', value: BUILD_PARAMETERS.gitCommit),
                    	string(name: 'LIVINGAPP_ENVIRONMENT_NAME', value: BUILD_PARAMETERS.bonitaEnvironment),
                    	booleanParam(name: 'DEBUG_MODE', value: BUILD_PARAMETERS.verbose)
                    ]
                    , wait: true)
     }
     
     if(livingAppBuild.result == null || livingAppBuild.result == 'SUCCESS'){
        stage('Deploy') {
	    	def livingAppDeploy = build(job: "livingapp-deploy"
	                    , parameters: [
	                    	string(name: 'BUILD_SELECTOR', value: """<SpecificBuildSelector plugin="copyartifact@1.43"><buildNumber>${livingAppBuild.number}</buildNumber></SpecificBuildSelector>"""),
	                    	string(name: 'BCD_CONFIGURATION_NAME', value: BUILD_PARAMETERS.bcdConfiguration),
	                    	string(name: 'RUNTIME_SELECTOR', value: BUILD_PARAMETERS.rumtime),
	                    	booleanParam(name: 'DEBUG_MODE', value: BUILD_PARAMETERS.verbose),
	                    	booleanParam(name: 'CONFIRM_DEPLOY', value: false)
	                    ]
	                    , wait: true)
	         
	        currentBuild.description = livingAppDeploy.description
	        def targetURI = new URI(new XmlSlurper().parseText(livingAppDeploy.description)['@href'].toString())
	        BUILD_PARAMETERS.targetURL = targetURI.scheme + '://' + targetURI.authority
    	}                                                         
     }

     
}
