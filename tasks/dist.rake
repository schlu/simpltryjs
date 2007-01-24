require 'rake/clean'
require 'fileutils'
require 'zip/ziprequire'
CLOBBER.include('simpltry_*')
DONT_COPY = [".", "..", 'dist', 'Rakefile', 'tasks']

desc "makes the js file"
task :dist => :clobber do
    dist_version = "simpltry_#{ENV['VERSION']}"
    files = Dir.entries(".")
    Dir.mkdir(dist_version)
    files.each do |file|
        cp_r(file, dist_version) if not DONT_COPY.include?(file)
    end
    rm_r(Dir["#{dist_version}/**/.DS_Store"])
    rm_r(Dir["#{dist_version}/**/.svn"])
    zip_file = "#{dist_version}.zip"
    Zip::ZipFile::open(zip_file, true) do |zf|
        Dir["#{dist_version}/**/*"].each { |f| zf.add(f, f) }
    end
    mv zip_file, "dist"
end