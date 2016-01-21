<?php

namespace AppBundle\Utils;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Session\Session;

class UIUtils
{
    public $equipment_requests_count;
    public $venue_requests_count;
    public $vehicle_requests_count;
    public $access_level;

    public function __construct(Session $session, Connection $conn)
    {
        //Fetching equipment requests count
        $stmt = $conn->prepare("SELECT dept_name FROM staff  where user_id =:user_id;");
        $stmt->bindValue(':user_id', $session->get('user_id'));
        $stmt->execute();
        $staff_member = $stmt->fetch()['dept_name'];
        $stmt = $conn->prepare('SELECT COUNT(DISTINCT request_id) AS count FROM resource_request WHERE (resource_request.resource_id is NULL OR resource_request.resource_id IN (SELECT resource_id FROM equipment)) AND resource_request.department_name = :dept_name AND resource_request.status = 2 AND date_from >= CURDATE();');
        $stmt->bindValue(':dept_name', $staff_member);
        $stmt->execute();
        $this->equipment_requests_count = $stmt->fetch()['count'];

        //Fetching venues requests count
        $stmt = $conn->prepare('CREATE OR REPLACE VIEW admin_resource_view  as select venue.resource_id from venue INNER JOIN resource_administration on venue.resource_id = resource_administration.resource_id and resource_administration.user_id = :user_id;');
        $stmt->bindValue(':user_id', $session->get('user_id'));
        $stmt->execute();

        $stmt = $conn->prepare('SELECT COUNT(DISTINCT request_id) AS count FROM resource_request INNER JOIN view1 using(resource_id) WHERE status = 2 AND date_from >= CURDATE();');
        $stmt->execute();
        $this->venue_requests_count = $stmt->fetch()['count'];

        //Fetching vehicle requests count
        $stmt = $conn->prepare('SELECT COUNT(DISTINCT vehicle_request.request_id) AS count FROM (vehicle_request INNER JOIN vehicle ON vehicle.type = vehicle_request.requested_type) INNER JOIN vehicle_administration ON vehicle.plate_no = vehicle_administration.plate_no WHERE vehicle_administration.user_id = :user_id AND vehicle_request.status = 2 AND date >= CURDATE();');
        $stmt->bindValue(':user_id', $session->get('user_id'));
        $stmt->execute();
        $this->vehicle_requests_count = $stmt->fetch()['count'];

        //Fetching access level
        $stmt = $conn->prepare('SELECT access_level FROM login INNER JOIN user USING(user_id) WHERE user_id = :user_id AND active = true;');
        $stmt->bindValue(':user_id', $session->get('user_id'));
        $stmt->execute();
        $this->access_level = $stmt->fetch()['access_level'];
    }
}