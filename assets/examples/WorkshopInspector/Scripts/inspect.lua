local H = require("UEHelpers")
local Inspect = {}

local function valid(object)
    if object == nil then return false end
    local ok, result = pcall(function() return object:IsValid() end)
    return ok and result == true
end

local function object(value)
    if valid(value) then return value end
    local ok, result = pcall(function() return value:get() end)
    if ok and valid(result) then return result end
end

local function name(value)
    if not valid(value) then return "<unavailable>" end
    return value:GetFullName() or "<unnamed>"
end

function Inspect.capture(config)
    local lines = {}
    local function add(text) lines[#lines + 1] = text end
    local viewport = H.GetGameViewportClient()
    if not valid(viewport) then return {"Viewport is not ready."} end
    local world = viewport:GetWorld()
    if not valid(world) then return {"World is not ready."} end
    add("World: " .. name(world))

    local gameplay = StaticFindObject("/Script/Engine.Default__GameplayStatics")
    if not valid(gameplay) then return {"GameplayStatics is unavailable."} end
    local pc = gameplay:GetPlayerController(world, 0)
    if not valid(pc) then
        add("Local controller is not ready.")
        return lines
    end

    local function describe(gun, label)
        if not valid(gun) then return end
        add(label .. ": " .. name(gun))
        for _, field in ipairs({"TotalErgo", "TotalInstalledErgo", "TotalRecoilControlModifier"}) do
            local ok, value = pcall(function() return gun[field] end)
            if ok and type(value) == "number" then
                add(string.format("  %s = %.6f", field, value))
            else
                add("  " .. field .. " = <unavailable>")
            end
        end
        local children = {}
        gun:GetAllChildActors(children, true)
        add("  Child actors reported: " .. tostring(#children))
        for i = 1, math.min(#children, config.MaxParts) do
            local child = object(children[i])
            if child then add("  Part " .. i .. ": " .. name(child)) end
        end
        if #children > config.MaxParts then add("  Remaining part names omitted by MaxParts.") end
    end

    local described = 0
    local pawn = pc:K2_GetPawn()
    if valid(pawn) then
        local ok, gun = pcall(function() return pawn.EquippedWeapon end)
        if ok and valid(gun) then describe(gun, "Equipped weapon"); described = described + 1 end
    end

    local editors = FindAllOf("WeaponEditMOde_C") or {}
    for i = 1, math.min(#editors, config.MaxEditors) do
        local editor = object(editors[i])
        if editor then
            local ok, visible = pcall(function() return editor:IsVisible() end)
            if ok and visible then
                add("Visible editor candidate: " .. name(editor))
                describe(editor.CurrentWeapon, "Workbench weapon")
                described = described + 1
            end
        end
    end
    if described == 0 then add("No equipped gun or visible workshop editor found.") end
    add("Snapshot finished. No parts, stats or saves were changed by this example.")
    return lines
end

return Inspect
