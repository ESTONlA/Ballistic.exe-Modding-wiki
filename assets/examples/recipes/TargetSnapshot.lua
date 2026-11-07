local H = require("UEHelpers")
local MaxTargets = 12
local queued = false

local function valid(object)
    if object == nil then return false end
    local ok, result = pcall(function() return object:IsValid() end)
    return ok and result == true
end

local function unwrap(value)
    if valid(value) then return value end
    local ok, object = pcall(function() return value:get() end)
    if ok and valid(object) then return object end
end

local function snapshot()
    local viewport = H.GetGameViewportClient()
    if not valid(viewport) then return {"Viewport is not ready."} end
    local world = viewport:GetWorld()
    if not valid(world) then return {"World is not ready."} end
    local gameplay = StaticFindObject("/Script/Engine.Default__GameplayStatics")
    local class = LoadAsset("/Game/BlueprintLogic/Targets/TargetBase.TargetBase_C")
    if not valid(gameplay) or not valid(class) then return {"Target discovery API/class unavailable."} end
    local targets = {}
    gameplay:GetAllActorsOfClass(world, class, targets)
    local lines = {"World: " .. world:GetFullName(), "Targets reported: " .. #targets}
    for i = 1, math.min(#targets, MaxTargets) do
        local actor = unwrap(targets[i])
        if actor then
            local position = actor:K2_GetActorLocation()
            lines[#lines + 1] = string.format(
                "%s | hit=%s | value=%s | actor=(%.1f, %.1f, %.1f)",
                actor:GetFullName(), tostring(actor.HasBeenHit), tostring(actor.HitValue),
                position.X, position.Y, position.Z)
        end
    end
    if #targets > MaxTargets then lines[#lines + 1] = "Remaining target lines omitted by MaxTargets." end
    if #targets == 0 then lines[#lines + 1] = "No targets found in this world; try a known range." end
    return lines
end

RegisterKeyBind(Key.F10, function()
    if queued then return end
    queued = true
    ExecuteInGameThread(function()
        local ok, lines = xpcall(snapshot, debug.traceback)
        queued = false
        if not ok then print("[TargetSnapshot] Failed: " .. tostring(lines) .. "\n"); return end
        for _, line in ipairs(lines) do print("[TargetSnapshot] " .. line .. "\n") end
    end)
end)

print("[TargetSnapshot] Teaching example loaded; F10 captures read-only target state.\n")
