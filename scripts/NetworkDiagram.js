var NetworkDiagram = {
    drawSwitch: function(style) {
        var image = Utils.createImage(this._canvas, "switch", {
            url: "/proxy/file/resource/network_switch.png",
            coordinates: JSRect.create(style.image_x, style.image_y, style.image_w, style.image_h),
            fit: true
        });
        debug.print("========================================== success create image");
        return image["coordinates"];
    },
    drawLine: function(data, style, row_index, object_h, linex, liney, image, idx) {
        var line = Line.create(data.Name + "_line" + row_index + "::" + idx);
        // 직사각형 엘레먼트당 하나의 line엘레먼트가 그려진다. 
        line.coordinates.Clear();
        linex = linex + (style.borderThickness / 2);
        //직사각형 엘레먼트의 border에 겹치지 않게 계산해준다 
        if (row_index == 0) {
            // 첫 번째 row줄이라면, 이미지 바로 밑 부터 선을 그어주기 시작한다. 
            line.coordinates.Add(new JSPoint(linex + (style.object_margin_w / 2), image.Bottom));
        } else {
            // 두 번째 row 부터는 전 row, 같은 column의 y부터 이어 그려준다. 
            line.coordinates.Add(new JSPoint(linex + (style.object_margin_w / 2), liney - object_h - style.object_margin_h));
        }
        line.coordinates.Add(new JSPoint(linex + (style.object_margin_w / 2), liney));
        //가로줄
        line.coordinates.Add(new JSPoint(linex, liney));
        // 기타 색상, 두께 등의 스타일 지정 
        line.color = JSColor.create(style.lineColor);
        line.fillColor = JSColor.create(style.lineColor);
        line.weight = style.lineThickness;
        line.startCap = "";
        line.endCap = "";
        this._canvas.add(line);
    },
    drawObject: function(data, style, image, idx, rows) {
        var col_count = style.object_count;
        //DTG Script안 style의 "object_count"를 가져온다. 
        //현재 style에서는 5로 설정되어있다. 한 줄에 최대 5개의 host object를 그려준다. 6번째 host object는 그 다음 줄에 그려진다.
        var object_x = style.image_x;
        var object_y = style.image_y + style.image_h + 100;
        // 이미지의 제일 밑 y값 (style.image_y + style.image_h)에서 100 정도의 공간을 마련해준다. 
        var object_w = (style.image_w / col_count) - style.object_margin_w;
        // 이미지의 가로길이(image_w)를 원하는 오브젝트 col갯수로 나눈 값으로만 설정하면 (style.image_w/col_count)
        // 직사각형 이미지들이 붙어있거나, 이미지 가로길이를 초과할 것이다. object_margin_w만큼 오브젝트 가로길이를 줄인다. 
        var object_h = style.image_h * 0.5;
        // 이미지 h를 보고 임의로 정해줬다. 
        if ((idx % col_count) == 0 && idx != 0) {
            // 해당 host object가 (style.object_count의 배수) 이고 제일 첫번째 host object가 아닌경우 
            // 예를들어, object_count=5라면, 5,10,..이라면 6번째, 11번째 오브젝트이므로 그 다음 row에 그려져야한다.  
            rows = rows + 1;
        }
        object_y = object_y + (object_h * rows) + (style.object_margin_h * rows);
        //해당 오브젝트 직사각형 엘레먼트의 y 값 계산
        debug.print("2.2 ========================================= " + data.Name + " row count is ");
        debug.print("row count : " + rows + ", " + typeof rows);
        debug.print("3. ========================================== " + data.Name + " object size is");
        debug.print("object_x : " + object_x + ", " + typeof object_x);
        debug.print("object_y : " + object_y + ", " + typeof object_y);
        debug.print("object_w : " + object_w + ", " + typeof object_w);
        debug.print("object_h : " + object_h + ", " + typeof object_h);
        debug.print("style.object_margin_w : " + style.object_margin_w + ", " + typeof style.object_margin_w);
        debug.print("idx : " + idx + ", " + typeof idx);
        debug.print("part ================================================== ");
        debug.print("idx % object_count : " + idx % col_count);
        debug.print("value : " + idx % col_count != 0);
        if (idx % col_count != 0) {
            // host object 직사각형 엘레먼트 위치가 첫번째 column이 아닌 경우 
            debug.print("4. ========================================== " + data.Name + " same line");
            debug.print("1. object_x : " + object_x);
            object_x = (object_x + (object_w * (idx % col_count))) + (style.object_margin_w * (idx % col_count));
            //시작 x점 계산
            debug.print("2. object_x : " + object_x + ", " + typeof object_x);
            debug.print("");
        }
        debug.print("6. ========================================== " + data.Name + " object size is");
        debug.print("object_x : " + object_x);
        debug.print("object_y : " + object_y);
        debug.print("object_w : " + object_w);
        debug.print("object_h : " + object_h);
        var TitleCaptionLength = (data.Label) ? data.Label.length : 0;
        var titlePosition;
        // 엘레먼트에 올라갈 타이틀 이름 위치 비율 계산
        // [[x1,y1], [x2,y2]]이며 , x1 + x2 = y1 + y2 = 1
        // x1, x2는 다 0.1, 0.9이다. 전체 x 길이에서 가운데 80%만 사용한다 (|0.1 - 0.9|)
        // 비율 계산은 나중에 Utils안에 있는  CreateUniversal (RectRTA)에서 계산된다. 
        if (TitleCaptionLength < 8) // 1~7  
        {
            titlePosition = [
                [0.10, 0.40],
                [0.90, 0.60]
            ];
            // 전체 y 길이의 가운데 20% 사용 ( |0.4 - 0.6|)
        } else if (TitleCaptionLength < 16) // 8~15
        {
            titlePosition = [
                [0.10, 0.30],
                [0.90, 0.70]
            ];
            // 전체 y 길이의 가운데 40% 사용 ( |0.3 - 0.7|)
        } else if (TitleCaptionLength < 24) // 16~23  
        {
            titlePosition = [
                [0.10, 0.20],
                [0.90, 0.80]
            ];
            // 전체 y 길이의 가운데 60% 사용 ( |0.2 - 0.8|)
        } else //24~
        {
            titlePosition = [
                [0.10, 0.15],
                [0.90, 0.85]
            ];
            // 전체 y 길이의 가운데 70% 사용 ( |0.15 - 0.85|)
        }
        Utils.CreateUniversal(this._canvas, {
            "ObjectName": data.Name,
            "Position": JSRect.create(object_x, object_y, object_w, object_h),
            "BorderColor": style.borderColor,
            "BackGroundColor": style.backGroundColor,
            "BorderRadius": style.borderRadius,
            "BorderThickness": style.borderThickness,
            "TitlePosition": titlePosition,
            "TitleAlignment": "center",
            "TitleColor": style.titleColor,
            "Label": (data.Properties.DisplayName && data.Properties.DisplayName.length != 0) ? data.Properties.DisplayName[0] : ((!data.Label || data.Label.length == 0) ? data.Name : data.Label),
            "AlarmLampPosition": [0.97, 0.15],
            "AlarmLampSize": 6,
            "AlarmLampColor": "#FF008000",
            "ShowAlarmLamp": style.showAlarmLamp,
            "MapLink": (data.Link) ? data.Link.MapId : "",
            "MapLinkTarget": ""
        });
        this.drawLine(data, style, rows, object_h, object_x + object_w, object_y + (object_h / 2), image, idx);
        return rows;
    },
    drawLoop: function(data, image, idx) {
        var rows = 0;
        for (var idx in data) {
            debug.print("2. ========================================== " + data[idx].Name + " index : " + idx);
            rows = this.drawObject(data[idx], data[idx].Style, image, parseInt(idx), rows);
            debug.print("7. ========================================== " + data[idx].Name + " rows : " + rows);
        }
    },
    main: function() {
        debug.print(JSON.stringify(this._data));
        var imageRect = this.drawSwitch(this._data[0].Style);
        debug.print("1. ========================================== image size is")
        debug.print("image_x : " + imageRect.X);
        debug.print("image_y : " + imageRect.Y);
        debug.print("image_w : " + imageRect.Width);
        debug.print("image_h : " + imageRect.Height);
        debug.print("image_left : " + imageRect.Left);
        debug.print("image_top : " + imageRect.Top);
        debug.print("image_right : " + imageRect.Right);
        debug.print("image_bottom : " + imageRect.Bottom);
        this.drawLoop(this._data, imageRect);
    }
}