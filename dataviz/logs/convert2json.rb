require 'json'
require 'date'

# build data table
noise_table = []
7.times { noise_table << [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] }
data = {:all => {:noise => noise_table}}

Dir.glob("*.TXT").each do |filename|
  File.open(filename, 'r') do |file|
    while line = file.gets
      timestamp, value = line.chomp.split(",")
      begin
        dd = DateTime.strptime(timestamp, '%s')
        data[:all][:noise][dd.cwday - 1][dd.hour] += value.to_i
      rescue
        p "error: #{filename} - timestamp: #{timestamp} - value: #{value}"
      end
    end
  end
end

File.open('../noise.json', 'w') do |file|
  file.write data.to_json
end
