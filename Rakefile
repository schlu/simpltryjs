Dir["tasks/*.rake"].each { |ext| load ext }
require 'tasks/javascripttest'
desc "Runs all the JavaScript unit tests and collects the results"
JavaScriptTestTask.new(:unittest) do |t|
    t.mount("/lib")
    t.mount("/src")
    t.mount("/test")
    
    Dir["test/**/*.html"].each do |file|
        t.run("/#{file}")
    end
    
    t.browser(:safari)
    t.browser(:firefox)
    t.browser(:ie)
    t.browser(:konqueror)
end
