function setFormat() {
	var progress = $('#progress');
	if($('#radFormatPercent').is(':checked')){
		progress.textprogress('setFormat','{percent}%');
	} else if ($('#radFormatCur').is(':checked')){
		progress.textprogress('setFormat','{current}');
	} else if ($('#radFormatCurTotal').is(':checked')){
		progress.textprogress('setFormat','{current}/{total}');
	}
}
$(document).ready(function () {
	$('#btnDestroy').click(function () {
		$('#progress').textprogress('destroy');
	});
	$('#chkShowCount').change(function () {
		$('#progress').textprogress('setShowCount', $(this).is(':checked'));
	});
	$('#chkOverLength').change(function () {
		$('#progress').textprogress('setAllowOverLength', $(this).is(':checked'));
	});
	$('#radFormatPercent').change(setFormat);
	$('#radFormatCur').change(setFormat);
	$('#radFormatCurTotal').change(setFormat);
});