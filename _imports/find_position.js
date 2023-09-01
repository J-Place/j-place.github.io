function FindPos(o) {
    if (("undefined" == typeof o ? "undefined" : _typeof(o)) || !o)
        return 0;
    var e = 0;
    if (o.offsetParent)
        do
            e += o.offsetTop;
        while (o = o.offsetParent);
    return e
}