local Config = require("config")
local Log = require("log")
local Inspect = require("inspect")

assert(type(Config.Enabled) == "boolean", "Enabled must be true or false")
assert(type(Config.KeyName) == "string" and Key[Config.KeyName], "KeyName is not a known key")
for _, field in ipairs({"MaxParts", "MaxEditors"}) do
    local value = Config[field]
    assert(type(value) == "number" and value % 1 == 0 and value >= 1 and value <= 64,
        field .. " must be an integer from 1 to 64")
end

if not Config.Enabled then
    Log.info("Disabled in config.lua.")
    return
end

local queued = false
RegisterKeyBind(Key[Config.KeyName], function()
    if queued then return end
    queued = true
    ExecuteInGameThread(function()
        local ok, result = xpcall(function()
            return Inspect.capture(Config)
        end, debug.traceback)
        queued = false
        if not ok then Log.info("Snapshot failed: " .. tostring(result)); return end
        for _, line in ipairs(result) do Log.info(line) end
    end)
end)

Log.info("Example loaded. Press " .. Config.KeyName .. " while the game is focused.")
