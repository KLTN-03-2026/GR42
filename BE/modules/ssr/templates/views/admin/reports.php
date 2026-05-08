<?php
layout('admin_header');
layout('admin_sidebar');
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
            <h4 class="fw-bold mb-0">Quản lý Báo cáo Vi phạm</h4>
            <p class="text-muted small mb-0">Xem và xử lý các báo cáo từ người dùng về bài báo và bình luận.</p>
        </div>
    </div>

    <!-- Data Table Card -->
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
            <h6 class="mb-0 fw-bold"><i class="fa-solid fa-flag me-2 text-danger"></i>Danh sách báo cáo mới nhất</h6>
            
            <div class="d-flex gap-2">
                <select class="form-select form-select-sm bg-light border-0" style="width: 150px;">
                    <option value="">Tất cả trạng thái</option>
                    <option value="0">Đang chờ</option>
                    <option value="1">Đã xử lý</option>
                </select>
                <div class="input-group" style="width: 250px;">
                    <input type="text" class="form-control form-control-sm bg-light border-0" placeholder="Tìm kiếm...">
                    <button class="btn btn-sm btn-light border-0"><i class="fa-solid fa-magnifying-glass"></i></button>
                </div>
            </div>
        </div>
        <div class="card-body p-0">
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="bg-light text-muted small text-uppercase">
                        <tr>
                            <th class="ps-4" width="10%">Loại</th>
                            <th width="15%">Người báo cáo</th>
                            <th width="15%">Đối tượng bị báo cáo</th>
                            <th width="20%">Lý do</th>
                            <th width="20%">Chi tiết</th>
                            <th width="10%">Trạng thái</th>
                            <th class="text-end pe-4" width="10%">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody class="border-top-0">
                        <?php if(!empty($reports)): ?>
                            <?php foreach($reports as $rpt): ?>
                                <tr>
                                    <td class="ps-4">
                                        <?php if($rpt['type'] === 'article'): ?>
                                            <span class="badge bg-info bg-opacity-10 text-info px-2 py-1 rounded-pill">Bài báo</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning bg-opacity-10 text-warning px-2 py-1 rounded-pill">Bình luận</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div>
                                                <h6 class="mb-0 fw-bold" style="font-size: 0.9rem;"><?= htmlspecialchars($rpt['reporter_name'] ?? 'Ẩn danh') ?></h6>
                                                <small class="text-muted" style="font-size: 0.75rem;">ID: #<?= $rpt['user_id'] ?? '?' ?></small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="text-dark small fw-medium" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="<?= htmlspecialchars($rpt['target_title']) ?>">
                                            <?= htmlspecialchars($rpt['target_title']) ?>
                                        </div>
                                    </td>
                                    <td>
                                        <span class="text-dark small"><?= htmlspecialchars($rpt['reason']) ?></span>
                                    </td>
                                    <td>
                                        <small class="text-muted"><?= htmlspecialchars($rpt['details'] ?? '---') ?></small>
                                    </td>
                                    <td>
                                        <?php if($rpt['status'] == 0): ?>
                                            <span class="badge bg-danger px-2 py-1 rounded-pill">Đang chờ</span>
                                        <?php else: ?>
                                            <span class="badge bg-success px-2 py-1 rounded-pill">Đã xử lý</span>
                                        <?php endif; ?>
                                    </td>
                                    <td class="text-end pe-4">
                                        <div class="d-flex justify-content-end gap-1">
                                            <?php if($rpt['status'] == 0): ?>
                                                <!-- Đánh dấu đã xử lý -->
                                                <a href="?module=admin&action=reports&report_action=process&id=<?= $rpt['id'] ?>&type=<?= $rpt['type'] ?>" 
                                                   class="btn btn-sm btn-light text-success rounded-circle" 
                                                   style="width: 32px; height: 32px; padding: 0; line-height: 32px;" 
                                                   title="Đã xử lý (Giữ lại nội dung)">
                                                   <i class="fa-solid fa-check"></i>
                                                </a>

                                                <!-- Duyệt vi phạm (Xóa nội dung + Báo cáo) -->
                                                <a href="?module=admin&action=reports&report_action=delete_content&id=<?= $rpt['id'] ?>&type=<?= $rpt['type'] ?>&target_id=<?= $rpt['target_id'] ?>" 
                                                   class="btn btn-sm btn-light text-danger rounded-circle" 
                                                   style="width: 32px; height: 32px; padding: 0; line-height: 32px;" 
                                                   title="Duyệt vi phạm (Xóa nội dung gốc)" 
                                                   onclick="return confirm('Xác nhận đây là vi phạm? Hệ thống sẽ XÓA VĨNH VIỄN nội dung bị báo cáo này.');">
                                                   <i class="fa-solid fa-user-slash"></i>
                                                </a>
                                            <?php endif; ?>
                                            
                                            <!-- Xóa bản ghi báo cáo -->
                                            <a href="?module=admin&action=reports&report_action=delete_report&id=<?= $rpt['id'] ?>&type=<?= $rpt['type'] ?>" 
                                               class="btn btn-sm btn-light text-secondary rounded-circle" 
                                               style="width: 32px; height: 32px; padding: 0; line-height: 32px;" 
                                               title="Xóa báo cáo này (Báo cáo sai)" 
                                               onclick="return confirm('Bạn có muốn xóa bản ghi báo cáo này không? (Nội dung gốc vẫn được giữ lại)');">
                                               <i class="fa-solid fa-trash-can"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="7" class="text-center py-5 text-muted">
                                    <div class="mb-3 text-secondary" style="font-size: 3rem;"><i class="fa-regular fa-flag text-opacity-25"></i></div>
                                    <h5 class="fw-bold text-dark text-opacity-50">Chưa có báo cáo nào</h5>
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<?php layout('admin_footer'); ?>
