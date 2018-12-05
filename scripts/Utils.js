var Utils  = {
    RectRTA : function (parentCoordinate, relativeCoordinate) {
        var X = parentCoordinate.Left + parentCoordinate.Width * relativeCoordinate[0][0];
        var Y = parentCoordinate.Top + parentCoordinate.Height * relativeCoordinate[0][1];
        var Right = parentCoordinate.Left + parentCoordinate.Width * relativeCoordinate[1][0];
        var Bottom = parentCoordinate.Top + parentCoordinate.Height * relativeCoordinate[1][1];
        return JSRect.create(X, Y, Right-X, Bottom-Y);
    }
    ,
    PointRTA : function (parentCoordinate, relativeCoordinate) {
        var X = parentCoordinate.Left + parentCoordinate.Width * relativeCoordinate[0];
        var Y = parentCoordinate.Top + parentCoordinate.Height * relativeCoordinate[1];
        return JSPoint.create(X, Y);
    }
    ,
    CreateUniversal : function(canvas, style) {
        var rect = null;
        var image = null;
        var text = null;
        var color = JSColor.create(style.BorderColor);
        var fillColor = JSColor.create(style.BackGroundColor);
        if (color.A != 0 || fillColor.A != 0 )
        {
            var rect = Rectangle.create(style.ObjectName + "::rect");
            var image = null;
            var text = null;
            rect.coordinates = style.Position;
            rect.color = color;
            rect.fillColor = fillColor;
            rect.radius = style.BorderRadius;
            rect.weight = style.BorderThickness;
            rect.mapLink = style.MapLink;
            rect.mapLinkTarget = style.MapLinkTarget;
            canvas.add(rect);
        }
        if (style.IconImageUrl && style.IconImageUrl.length != 0)
        {
            image = Image.create(style.ObjectName + "::image");
            image.coordinates = Utils.RectRTA(style.Position, style.IconPosition);
            image.url = style.IconImageUrl;
            image.fit = true;
            canvas.add(image);
        }
        if (style.Label && style.Label.length != 0)
        {
            var text = Text.create(style.ObjectName + "::text");
            text.coordinates = Utils.RectRTA(style.Position, style.TitlePosition);
            text.alignment = style.TitleAlignment;
            text.color = JSColor.create(style.TitleColor);
            text.fontSize = "";
            text.textAlign = "center";
            text.text = style.Label;
            if (style.LinkUrl && style.LinkUrl.length != 0 && style.LinkUrl != "null")
            {
                text.actions.add("click", "newTab", [style.LinkUrl]);
            }
            canvas.add(text);
        }
        if (style.ShowAlarmLamp == true)
        {
            var lamp = Lamp.create(style.ObjectName + "::lamp");
            lamp.coordinates = Utils.PointRTA(style.Position, style.AlarmLampPosition);
            lamp.radius = style.AlarmLampSize;
            lamp.fillColor = JSColor.create(style.AlarmLampColor);
            lamp.objectName = style.ObjectName;
            canvas.add(lamp);
        }
        return rect;
    }
    ,
    createRect: function(canvas, name, style)
    {
        var rect = Rectangle.create(name);
        rect.coordinates = (style.coordinates)?style.coordinates:JSRect.create(0,0,10,10);
        rect.color = (style.color)?JSColor.create(style.color):JSColor.create("#FFFFFFFF");
        rect.fillColor = (style.fillColor)?JSColor.create(style.fillColor):JSColor.create("#80000000");
        rect.radius = (style.radius)?style.radius:0;
        rect.weight = (style.weight)?style.weight:1;
        rect.mapLink = (style.mapLink)?style.mapLink:"";
        rect.mapLinkTarget = (style.mapLinkTarget)?style.mapLinkTarget:"";
        canvas.add(rect);
        return rect;
    }
    ,
    createText: function(canvas, name, style)
    {
        var text = Text.create(name);
        text.coordinates = (style.coordinates)?style.coordinates:JSRect.create(0,0,10,10);
        text.color = (style.color)?JSColor.create(style.color):JSColor.create("#FFFFFFFF");
        text.text = (style.text)?style.text:"";
        text.textAlign = (style.textAlign)?style.textAlign:"center";
        text.fontSize = (style.fontSize)?style.fontSize:"";
        text.objectName = (style.objectName)?style.objectName:"";
        canvas.add(text);
        return text;
    }
    ,
    createImage: function(canvas, name, style)
    {
        image = Image.create(name);
        image.coordinates = style.coordinates;
        image.url = style.url;
        image.fit = style.fit;
        canvas.add(image);
        return image;
    }
    ,
    createIFrame: function(canvas, name, style)
    {
        box = Box.create(name);
        box.coordinates = style.coordinates;
        box.content = style.content;
        canvas.add(box);
        return box;
    }
    ,
    createLamp: function(canvas, name, style)
    {
        var lamp = Lamp.create(name);
        lamp.coordinates = (style.coordinates)?style.coordinates:JSPoint.create(10,10);
        lamp.radius = (style.radius)?style.radius:6;
        lamp.fillColor = (style.fillColor)?JSColor.create(style.fillColor):JSColor.create("#FFFFFFFF");
        lamp.objectName = (style.objectName)?style.objectName:"";
        canvas.add(lamp);
        return lamp;
    }
    ,
    createEllipse: function(canvas, name, style)
    {
        var ellipse = Ellipse.create(name);
        ellipse.coordinates = style.coordinates;
        ellipse.color = (style.color)?JSColor.create(style.color):JSColor.create("#FFFFFFFF");
        ellipse.fillColor = (style.fillColor)?JSColor.create(style.fillColor):JSColor.create("#80000000");
        ellipse.weight = (style.weight)?style.weight:1;
        ellipse.mapLink = (style.mapLink)?style.mapLink:"";
        ellipse.mapLinkTarget = (style.mapLinkTarget)?style.mapLinkTarget:"";
        canvas.add(ellipse);
        return ellipse;
    }
    ,
    createLine: function(canvas, name, style)
    {
        var line = Line.create(name);
        //line.coordinates = style.coordinates;
        line.coordinates.Clear();
        for(var idx in style.coordinates)
        {
            line.coordinates.Add(style.coordinates[idx]);
        }
        line.color = (style.color)?JSColor.create(style.color):JSColor.create("#FFFFFFFF");
        line.fillColor = (style.fillColor)?JSColor.create(style.fillColor):JSColor.create("#80000000");
        line.weight = (style.weight)?style.weight:1;
        line.startCap = (style.startCap)?style.startCap:"";
        line.endCap = (style.endCap)?style.endCap:"";
        canvas.add(line);
        return line;
    }
    ,
    createText: function(canvas, name, style)
    {
        var text = Text.create(name);
        text.coordinates = (style.coordinates)?style.coordinates:JSRect.create(0,0,10,10);
        text.color = (style.color)?JSColor.create(style.color):JSColor.create("#FFFFFFFF");
        text.text = (style.text)?style.text:"";
        text.textAlign = (style.textAlign)?style.textAlign:"center";
        text.fontSize = (style.fontSize)?style.fontSize:"";
        text.objectName = (style.objectName)?style.objectName:"";
        canvas.add(text);
        return text;
    }
    ,
    Clone : function (source, name) {
        var target = UIETManager.Get(source.classname).create(name);
        for(var e in source)
        {
            if (e == "classname" || e == "id" || e == "name" || e == "dataBinding" || e == "valueOf") continue;
            target[e] = source[e];
        }
        return target;
    }
}
